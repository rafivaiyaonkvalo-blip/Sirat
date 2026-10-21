const modules = import.meta.glob('./dars/dars-*.json');

export function loadDars(id) {
  const key = `./dars/dars-${String(id).padStart(2, '0')}.json`;
  return modules[key] ? modules[key]().then((m) => m.default) : Promise.resolve(null);
}
