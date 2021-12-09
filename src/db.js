export const openDb = (dbName, version, tableName) => {
  return new Promise((resolve, reject) => {
    const dbRequest = window.indexedDB.open(dbName, version);

    dbRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(tableName)) {
        db.createObjectStore(tableName, { keyPath: "no" });
      }
    };

    dbRequest.onsuccess = () => {
      resolve(dbRequest.result);
    };

    dbRequest.onerror = (e) => {
      reject(e);
    };
  });
};

export const getObjectStore = (db, tableName) => {
  return db.transaction([tableName], "readwrite").objectStore(tableName);
};

export const addData = (objectStore, data) => {
  return new Promise((resolve, reject) => {
    const objectStoreRequest = objectStore.add(data);

    objectStoreRequest.onsuccess = () => {
      resolve({
        code: 0,
        message: "Add data success.",
      });
    };

    objectStoreRequest.onerror = (e) => {
      reject(e);
    };
  });
};

export const updateData = (objectStore, data) => {
  return new Promise((resolve, reject) => {
    const objectStoreRequest = objectStore.put(data);

    objectStoreRequest.onsuccess = () => {
      resolve({
        code: 0,
        message: "Update data success.",
      });
    };

    objectStoreRequest.onerror = (e) => {
      reject(e);
    };
  });
};

export const getData = (objectStore, key) => {
  return new Promise((resolve, reject) => {
    const objectStoreRequest = objectStore.get(key);

    objectStoreRequest.onsuccess = (e) => {
      const result = e.target.result;
      resolve(result);
    };

    objectStoreRequest.onerror = (e) => {
      reject(e);
    };
  });
};

export const getAll = (objectStore) => {
  return new Promise((resolve) => {
    const cursors = objectStore.openCursor();
    const list = [];
    cursors.onsuccess = (e) => {
      const cursor = e.target.result;

      if (cursor) {
        list.push(cursor.value);
        cursor.continue();
      } else {
        resolve(list);
      }
    };
  });
};

export const clearAll = (objectStore) => {
  return new Promise((resolve, reject) => {
    const dbRequest = objectStore.clear();

    dbRequest.onsuccess = () => {
      resolve({
        code: 0,
        message: "Clear objectStore success.",
      });
    };

    dbRequest.onerror = (e) => {
      reject(e);
    };
  });
};

export const deleteDb = (dbName) => {
  return new Promise((resolve, reject) => {
    const dbRequest = window.indexedDB.deleteDatabase(dbName);

    dbRequest.onsuccess = () => {
      resolve({
        code: 0,
        message: "Delete database success.",
      });
    };

    dbRequest.onerror = (e) => {
      reject(e);
    };
  });
};
