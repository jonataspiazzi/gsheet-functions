interface ActivityItem {
  id: string;
  dependenciesNames: string[],
  priority: number,
  dependencies: ActivityItem[]
}

interface Dictionary<T> {
  [key: string]: T;
}

function makeActivityItem(row: any[], idColumnIndex: number, dependenciesColumnIndex: number, priorityColumnIndex: number): ActivityItem {
  return {
    id: row[idColumnIndex],
    dependenciesNames: row[dependenciesColumnIndex] ? row[dependenciesColumnIndex].split(/\,\s*/g) : [],
    priority: Number(row[priorityColumnIndex]) || undefined,
    dependencies: []
  };
}

function toActivityDictionary(items: ActivityItem[]) {
  const dic = {} as Dictionary<ActivityItem>;

  for (const item of items) {
    dic[item.id] = item;
  }

  return dic;
}

function connectDependencies(items: ActivityItem[], itemsDic: Dictionary<ActivityItem>) {
  for (const item of items) {
    for (const dependencyName of item.dependenciesNames) {
      const itemDep = itemsDic[dependencyName];

      if (!itemDep) continue;
      if (item.dependencies.indexOf(itemDep) >= 0) continue;

      item.dependencies.push(itemDep);
    }
  }
}

function traverse(item: ActivityItem): ActivityItem[] {
  if (!item) return [];
  if (!item.dependencies.length) return [item];

  const items = new Array<ActivityItem>();

  for (const dependency of item.dependencies.sort((left, right) => left.priority - right.priority)) {
    if (!dependency) continue;

    items.push(...traverse(dependency));
  }

  items.push(item);

  return items;
}

/**
 * Give a number representing an order of a specific item identified by `id`.
 * @param id Id of the item to find order index.
 * @param matrix Two dimensional array with columns of `id`, `dependencies`, `priority`
 * @param idColumnIndex Zero based index of the column in `matrix` that contains the `id` information.
 * @param dependenciesColumnIndex Zero based index of the column in `matrix` that contains the `dependencies` information.
 * @param priorityColumnIndex Zero based index of the column in `matrix` that contains the `priorities` information.
 */
export function GET_ORDER(id: string, matrix: Array<Array<any>>, idColumnIndex: number, dependenciesColumnIndex: number, priorityColumnIndex: number) {
  if (!id) return "";
  if (!matrix) return "";
  if (isNaN(Number(idColumnIndex))) return "";
  if (isNaN(Number(dependenciesColumnIndex))) return "";
  if (isNaN(Number(priorityColumnIndex))) return "";

  const items = matrix
    .map(row => makeActivityItem(row, idColumnIndex, dependenciesColumnIndex, priorityColumnIndex))
    .filter(item => item.id && !isNaN(Number(item.priority)));

  const currentItem = items.find(i => i.id === id);
  if (!currentItem) return "";

  const itemsDic = toActivityDictionary(items);

  connectDependencies(items, itemsDic);

  const ROOT_ID = '##ROOT';

  const result = traverse({ id: ROOT_ID, dependencies: items } as ActivityItem);
  result.splice(result.findIndex(r => r.id === ROOT_ID), 1);

  const reduced = result.reduce((ac, i) => {
    if (ac.indexOf(i) < 0) {
      ac.push(i);
    }
    return ac;
  }, new Array<ActivityItem>());

  return reduced.findIndex(item => item.id === id) + 1;
}
