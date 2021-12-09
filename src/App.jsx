import { createSignal, onMount } from "solid-js";
import dataJson from "./data.json";
import { addData, getAll, getObjectStore, openDb, updateData } from "./db";

const columns = [
  { key: "checked", value: "是否达成目标" },
  { key: "no", value: "编号" },
  { key: "name", value: "名称" },
  { key: "group", value: "阵营" },
  { key: "type", value: "舰种" },
  {
    key: "points",
    value: "科技点",
    children: [
      { key: "get", value: "获得" },
      { key: "star", value: "满星" },
      { key: "120", value: "Lv.<wbr>120" },
      { key: "total", value: "合计" },
    ],
  },
  {
    key: "attrs",
    value: "属性加成",
    children: [
      { key: "get", value: "解锁" },
      { key: "120", value: "120级" },
    ],
  },
];

function App() {
  const [getIsLoading, setIsLoading] = createSignal(false);
  const [getList, setList] = createSignal([]);
  const [getHiddenList, setHiddenList] = createSignal([]);

  onMount(async () => {
    try {
      setIsLoading(true);
      const db = await openDb("blhx", 1, "ships");
      const objectStore = getObjectStore(db, "ships");
      const data = await getAll(objectStore);
      if (data.length === 0) {
        dataJson.forEach(async (data) => {
          await addData(objectStore, data);
        });
      }
      const newData = await getAll(objectStore);
      setList(newData.filter((item) => item.hidden === false));
      setHiddenList(newData.filter((item) => item.hidden === true));
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  });

  const onCheck = async (index) => {
    setIsLoading(true);
    const db = await openDb("blhx", 1, "ships");
    const objectStore = getObjectStore(db, "ships");

    const newData = { ...getList()[index] };
    newData.hidden = true;

    await updateData(objectStore, newData);
    const data = await getAll(objectStore);
    setList(data.filter((item) => item.hidden === false));
    setHiddenList(data.filter((item) => item.hidden === true));
    setIsLoading(false);
  };

  const onUnCheck = async (index) => {
    const db = await openDb("blhx", 1, "ships");
    const objectStore = getObjectStore(db, "ships");

    const newData = { ...getHiddenList()[index] };
    newData.hidden = false;

    await updateData(objectStore, newData);
    const data = await getAll(objectStore);
    setList(data.filter((item) => item.hidden === false));
    setHiddenList(data.filter((item) => item.hidden === true));
    setIsLoading(false);
  };

  return (
    <>
      {getIsLoading() && (
        <div class="text-center">
          <div class="spinner-border" role="status"></div>
        </div>
      )}
      {(getList().length > 0 || getHiddenList().length > 0) && (
        <table class="table table-striped table-bordered text-center">
          <thead>
            <tr>
              {columns.map((item) => {
                const { key, value, children } = item;
                if (children) {
                  return (
                    <th
                      class="align-middle"
                      key={key}
                      scope="col"
                      colSpan={children.length}
                    >
                      {value}
                    </th>
                  );
                }
                return (
                  <th class="align-middle" key={key} scope="col" rowSpan={2}>
                    {value}
                  </th>
                );
              })}
            </tr>
            <tr>
              {columns.map((item) => {
                const { children } = item;
                if (children) {
                  return children.map((child) => {
                    const { key, value } = child;
                    return (
                      <th class="align-middle" key={key} scope="col">
                        {value}
                      </th>
                    );
                  });
                }
              })}
            </tr>
          </thead>
          {getList().length > 0 && (
            <>
              <tr>
                <th>
                  <a
                    class="link-primary"
                    data-bs-toggle="collapse"
                    href="#todo"
                    aria-expanded="true"
                    aria-controls="todo"
                  >
                    未达成目标({getList().length})
                  </a>
                </th>
              </tr>
              <tbody class="collapse show" id="todo">
                {getList().map((item, index) => {
                  const { no, name, group, type, points, attrs } = item;
                  return (
                    <tr>
                      <th>
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          onClick={() => {
                            onCheck(index);
                          }}
                        />
                      </th>
                      <th scope="row">{no}</th>
                      <td>{name}</td>
                      <td>{group}</td>
                      <td>{type}</td>
                      {points.map((point) => {
                        return <td>{point}</td>;
                      })}
                      {attrs.map((attr) => {
                        return <td>{attr}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </>
          )}
          {getHiddenList().length > 0 && (
            <>
              <tr>
                <th>
                  <a
                    class="link-success"
                    data-bs-toggle="collapse"
                    href="#done"
                    aria-expanded="true"
                    aria-controls="done"
                  >
                    已达成目标({getHiddenList().length})
                  </a>
                </th>
              </tr>
              <tbody class="collapse" id="done">
                {getHiddenList().map((item, index) => {
                  const { no, name, group, type, points, attrs } = item;
                  return (
                    <tr>
                      <th>
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          checked
                          onClick={() => {
                            onUnCheck(index);
                          }}
                        />
                      </th>
                      <th scope="row">{no}</th>
                      <td>{name}</td>
                      <td>{group}</td>
                      <td>{type}</td>
                      {points.map((point) => {
                        return <td>{point}</td>;
                      })}
                      {attrs.map((attr) => {
                        return <td>{attr}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </>
          )}
        </table>
      )}
    </>
  );
}

export default App;
