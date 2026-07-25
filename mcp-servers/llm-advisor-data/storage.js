const fs = require("node:fs").promises;
const path = require("node:path");
const crypto = require("node:crypto");
const lockfile = require("proper-lockfile");

class JsonFileStore {
  constructor({ fsApi = fs, lockApi = lockfile } = {}) {
    this.fs = fsApi;
    this.lockApi = lockApi;
    this.queues = new Map();
  }

  // validators.accept guards what the mutator structurally needs from the
  // current document; validators.publish is the full check the result must pass
  // before anything is written. Splitting them keeps a mutation able to repair a
  // document that the full validator rejects.
  mutate(filePath, validators, mutator) {
    const prior = this.queues.get(filePath) || Promise.resolve();
    const mutation = prior.then(() =>
      this.#mutateOnce(filePath, validators, mutator)
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

  async #mutateOnce(filePath, validators, mutator) {
    const release = await this.lockApi.lock(filePath, {
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

    let result;
    try {
      const current = JSON.parse(await this.fs.readFile(filePath, "utf8"));
      validators.accept(current);
      result = await mutator(current);
      validators.publish(result);
      await this.#replace(filePath, result);
    } catch (error) {
      // Nothing was published, so the caller must see why. A release failure
      // here is secondary to the error that actually stopped the mutation.
      await release().catch(() => {});
      throw error;
    }

    // #replace renamed the file, so the mutation is already visible and the
    // caller has to see success. Releasing the advisory lock cannot undo that,
    // and reporting a failure would make a retried add_case_study or
    // add_changelog_entry append the same entry twice. A lock left behind is
    // still real and needs a human, so report it on stderr, which is this
    // server's diagnostic channel because stdout carries the MCP protocol.
    await release().catch((error) => {
      console.error(
        `lock release failed for ${filePath} after the write was published: ${error.message}`
      );
    });
    return result;
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
    } catch (error) {
      if (handle) {
        await handle.close().catch(() => {});
      }
      await this.fs.unlink(temporaryPath).catch(() => {});
      throw error;
    }

    // The rename published the mutation, so the operation has succeeded. Syncing
    // the parent directory only makes that durable across a crash, and opening a
    // directory is unsupported on some platforms and filesystems. Reporting a
    // failure here would tell the caller a write failed after it landed, and a
    // retried add_case_study or add_changelog_entry would duplicate the entry.
    await this.#syncDirectory(directory);
  }

  async #syncDirectory(directory) {
    let handle;
    try {
      handle = await this.fs.open(directory, "r");
      await handle.sync();
    } catch {
      return;
    } finally {
      if (handle) {
        await handle.close().catch(() => {});
      }
    }
  }
}

module.exports = { JsonFileStore };
