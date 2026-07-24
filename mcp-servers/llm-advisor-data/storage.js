const fs = require("node:fs").promises;
const path = require("node:path");
const crypto = require("node:crypto");
const lockfile = require("proper-lockfile");

class JsonFileStore {
  constructor({ fsApi = fs } = {}) {
    this.fs = fsApi;
    this.queues = new Map();
  }

  mutate(filePath, validate, mutator) {
    const prior = this.queues.get(filePath) || Promise.resolve();
    const mutation = prior.then(() =>
      this.#mutateOnce(filePath, validate, mutator)
    );
    const settled = mutation.catch(() => {});
    this.queues.set(filePath, settled);
    settled.finally(() => {
      if (this.queues.get(filePath) === settled) {
        this.queues.delete(filePath);
      }
    });
    return mutation;
  }

  async #mutateOnce(filePath, validate, mutator) {
    const release = await lockfile.lock(filePath, {
      realpath: false,
      stale: 30_000,
      update: 10_000,
      retries: {
        retries: 20,
        factor: 1.25,
        minTimeout: 10,
        maxTimeout: 250,
        randomize: true,
      },
    });

    try {
      const current = JSON.parse(await this.fs.readFile(filePath, "utf8"));
      validate(current);
      const result = await mutator(current);
      validate(result);
      await this.#replace(filePath, result);
      return result;
    } finally {
      await release();
    }
  }

  async #replace(filePath, data) {
    const directory = path.dirname(filePath);
    const temporaryPath = path.join(
      directory,
      `.${path.basename(filePath)}.${process.pid}.${crypto.randomUUID()}.tmp`
    );
    const mode = (await this.fs.stat(filePath)).mode & 0o777;
    let handle;

    try {
      handle = await this.fs.open(temporaryPath, "wx", mode);
      await handle.chmod(mode);
      await handle.writeFile(`${JSON.stringify(data, null, 2)}\n`, "utf8");
      await handle.sync();
      await handle.close();
      handle = undefined;
      await this.fs.rename(temporaryPath, filePath);
      const directoryHandle = await this.fs.open(directory, "r");
      try {
        await directoryHandle.sync();
      } finally {
        await directoryHandle.close();
      }
    } catch (error) {
      if (handle) {
        await handle.close().catch(() => {});
      }
      await this.fs.unlink(temporaryPath).catch(() => {});
      throw error;
    }
  }
}

module.exports = { JsonFileStore };
