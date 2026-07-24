const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const fs = require("node:fs").promises;
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { JsonFileStore } = require("./storage.js");

function validateItems(data) {
  if (!data || !Array.isArray(data.items)) {
    throw new Error("items must be an array");
  }
}

async function makeState(initial) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "llm-advisor-data-"));
  const filePath = path.join(directory, "state.json");
  await fs.writeFile(filePath, JSON.stringify(initial), "utf8");
  return { directory, filePath };
}

function mutateInChild(filePath, item, delay) {
  const script = `
    const { JsonFileStore } = require("./storage.js");
    const validate = (data) => {
      if (!data || !Array.isArray(data.items)) {
        throw new Error("items must be an array");
      }
    };
    new JsonFileStore()
      .mutate(process.env.TEST_STATE_FILE, validate, async (data) => {
        await new Promise((resolve) =>
          setTimeout(resolve, Number(process.env.TEST_DELAY))
        );
        data.items.push(process.env.TEST_ITEM);
        return data;
      })
      .catch((error) => {
        console.error(error);
        process.exitCode = 1;
      });
  `;

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["-e", script], {
      cwd: __dirname,
      env: {
        ...process.env,
        TEST_STATE_FILE: filePath,
        TEST_ITEM: item,
        TEST_DELAY: String(delay),
      },
      stdio: ["ignore", "ignore", "pipe"],
    });
    let stderr = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`child mutation failed (${code}): ${stderr}`));
      }
    });
  });
}

test("concurrent mutations preserve both updates", async (t) => {
  const { directory, filePath } = await makeState({ items: [] });
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const store = new JsonFileStore();

  await Promise.all([
    store.mutate(filePath, validateItems, async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 25));
      data.items.push("first");
      return data;
    }),
    store.mutate(filePath, validateItems, (data) => {
      data.items.push("second");
      return data;
    }),
  ]);

  const stored = JSON.parse(await fs.readFile(filePath, "utf8"));
  assert.deepEqual(stored.items, ["first", "second"]);
});

test("separate store instances preserve concurrent updates", async (t) => {
  const { directory, filePath } = await makeState({ items: [] });
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const firstStore = new JsonFileStore();
  const secondStore = new JsonFileStore();

  await Promise.all([
    firstStore.mutate(filePath, validateItems, async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 25));
      data.items.push("first");
      return data;
    }),
    secondStore.mutate(filePath, validateItems, (data) => {
      data.items.push("second");
      return data;
    }),
  ]);

  const stored = JSON.parse(await fs.readFile(filePath, "utf8"));
  assert.equal(stored.items.length, 2);
  assert.deepEqual(new Set(stored.items), new Set(["first", "second"]));
});

test("separate processes preserve concurrent updates", async (t) => {
  const { directory, filePath } = await makeState({ items: [] });
  t.after(() => fs.rm(directory, { recursive: true, force: true }));

  await Promise.all([
    mutateInChild(filePath, "first", 75),
    mutateInChild(filePath, "second", 0),
  ]);

  const stored = JSON.parse(await fs.readFile(filePath, "utf8"));
  assert.equal(stored.items.length, 2);
  assert.deepEqual(new Set(stored.items), new Set(["first", "second"]));
});

test("atomic replacement preserves the original mode under a restrictive umask", async (t) => {
  const { directory, filePath } = await makeState({ items: [] });
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  await fs.chmod(filePath, 0o644);
  const store = new JsonFileStore();
  const previousUmask = process.umask(0o077);

  try {
    await store.mutate(filePath, validateItems, (data) => {
      data.items.push("published");
      return data;
    });
  } finally {
    process.umask(previousUmask);
  }

  const mode = (await fs.stat(filePath)).mode & 0o777;
  assert.equal(mode, 0o644);
});

test("atomic replacement syncs the parent directory after rename", async (t) => {
  const { directory, filePath } = await makeState({ items: [] });
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const events = [];
  const tracingFs = {
    ...fs,
    open: async (target, ...args) => {
      const handle = await fs.open(target, ...args);
      if (target !== directory) {
        return handle;
      }
      return {
        sync: async () => {
          events.push("directory-sync");
          await handle.sync();
        },
        close: () => handle.close(),
      };
    },
    rename: async (...args) => {
      await fs.rename(...args);
      events.push("rename");
    },
  };
  const store = new JsonFileStore({ fsApi: tracingFs });

  await store.mutate(filePath, validateItems, (data) => {
    data.items.push("published");
    return data;
  });

  assert.deepEqual(events, ["rename", "directory-sync"]);
});

test("a failed atomic replacement leaves the prior JSON readable", async (t) => {
  const { directory, filePath } = await makeState({ items: ["prior"] });
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const failingFs = {
    ...fs,
    rename: async () => {
      throw new Error("replace failed");
    },
  };
  const store = new JsonFileStore({ fsApi: failingFs });

  await assert.rejects(
    store.mutate(filePath, validateItems, (data) => {
      data.items.push("unpublished");
      return data;
    }),
    /replace failed/
  );

  const stored = JSON.parse(await fs.readFile(filePath, "utf8"));
  assert.deepEqual(stored.items, ["prior"]);
  assert.deepEqual(await fs.readdir(directory), ["state.json"]);
});

test("invalid resulting data is rejected before publication", async (t) => {
  const { directory, filePath } = await makeState({ items: ["prior"] });
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const store = new JsonFileStore();

  await assert.rejects(
    store.mutate(filePath, validateItems, () => ({ items: "invalid" })),
    /items must be an array/
  );

  const stored = JSON.parse(await fs.readFile(filePath, "utf8"));
  assert.deepEqual(stored.items, ["prior"]);
});
