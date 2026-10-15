// Trvalé úložiště pro webovou verzi: obsah složky s uloženými hrami a settings.ini v IndexedDB.
// .NET v prohlížeči zapisuje soubory jen do paměti (po obnovení stránky by zmizely), proto je
// WebStorage.cs sem zrcadlí a při startu vrací zpět. Klíč = cesta souboru relativně ke složce hry.
window.taStore = (function () {
    const DB = 'TinyAdventurer', STORE = 'files';

    function open() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB, 1);
            req.onupgradeneeded = () => req.result.createObjectStore(STORE);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function run(mode, action) {
        const db = await open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE, mode);
            const result = action(tx.objectStore(STORE));
            tx.oncomplete = () => { db.close(); resolve(result && result.result); };
            tx.onerror = () => { db.close(); reject(tx.error); };
        });
    }

    return {
        // [{ path, data }] – data jako base64 (jednoduché předání do .NET)
        loadAll: async function () {
            const files = [];
            try {
                await run('readonly', store => {
                    const req = store.openCursor();
                    req.onsuccess = () => {
                        const c = req.result;
                        if (!c) return;
                        files.push({ path: c.key, data: c.value });
                        c.continue();
                    };
                });
            } catch (e) {
                console.warn('[storage] IndexedDB nejde číst (soukromé okno?):', e);
            }
            return files;
        },
        put: function (path, base64) {
            return run('readwrite', store => store.put(base64, path))
                .catch(e => console.warn('[storage] uložení selhalo:', path, e));
        },
        remove: function (path) {
            return run('readwrite', store => store.delete(path))
                .catch(e => console.warn('[storage] smazání selhalo:', path, e));
        }
    };
})();
