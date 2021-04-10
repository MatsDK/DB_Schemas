import axios from "axios";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

const MIN_CEL_WIDTH: number = 40;
const createHeaders = (headers: any[]) => {
  return headers.map((item: any) => ({
    contents: item,
    ref: useRef<HTMLTableHeaderCellElement>(null),
  }));
};

const id = ({ data }) => {
  if (!data) return <div></div>;

  const [headers] = useState<string[]>([
    "",
    "_id",
    ...Object.keys(data?.schema || {}),
  ]);
  const rows = useRef(data.rows.map(() => React.createRef()));
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const tableElement = useRef<HTMLTableElement>(null);
  const columns = createHeaders(headers);
  const [activeRow, setActiveRowIdx] = useState<number | null>(null);

  const mouseDown = (index: number) => {
    setActiveIndex(index);
  };

  const mouseMove = useCallback(
    (e) => {
      const gridColumns = columns.map((col, i) => {
        if (i === activeIndex)
          if (col.ref && col.ref.current) {
            const width = e.clientX - col.ref.current.offsetLeft;
            if (width >= MIN_CEL_WIDTH) return `${width}px`;
          }

        if (col.ref && col.ref.current)
          return `${col.ref.current.offsetWidth}px`;
      });
      if (tableElement && tableElement.current)
        tableElement.current.style.gridTemplateColumns = `${gridColumns.join(
          " "
        )}`;
    },
    [activeIndex, columns, MIN_CEL_WIDTH]
  );

  const removeListeners = useCallback(() => {
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", removeListeners);
  }, [mouseMove]);

  const mouseUp = useCallback(() => {
    setActiveIndex(null);
    removeListeners();
  }, [setActiveIndex, removeListeners]);

  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }

    return () => {
      removeListeners();
    };
  }, [activeIndex, mouseMove, mouseUp, removeListeners]);

  const setActiveRow = (idx: number) => {
    rows.current.forEach((rowEl: any) => {
      rowEl.current.classList.remove("activeRow");
    });

    if (activeRow === idx) {
      rows.current[idx].current.classList.remove("activeRow");
      setActiveRowIdx(null);
    } else {
      rows.current[idx].current.classList.add("activeRow");
      setActiveRowIdx(idx);
    }
  };

  return data && rows ? (
    <div>
      <div>{data.dbName}</div>
      <Link href="/">hello world</Link>
      <div className="table-wrapper">
        <table
          className="dataTable"
          ref={tableElement}
          style={{
            gridTemplateColumns: `${new Array(headers.length)
              .fill("41px")
              .fill("minmax(150px, 1fr)", 1)
              .join(" ")}`,
          }}
        >
          <thead className="heading">
            <tr>
              {columns &&
                columns.map(({ ref, contents }, idx: number) => {
                  return (
                    <th key={idx} ref={ref}>
                      <span>
                        <p>{contents}</p>
                        <p className="header-type">
                          {data.schema[contents] &&
                          data.schema[contents]._isSchemaRef
                            ? data.schema[contents].modelName + " Schema"
                            : contents && "type"}
                        </p>
                      </span>
                      <div
                        style={{ height: "50px" }}
                        onMouseDown={() => mouseDown(idx)}
                        className={`resize-handle ${
                          activeIndex === idx ? "active" : "idle"
                        }`}
                      />
                    </th>
                  );
                })}
            </tr>
          </thead>
          <tbody className="rows">
            {data &&
              data.rows.map((row: any, i: number) => {
                return (
                  <tr
                    className="dataTableRow"
                    key={row._id}
                    ref={rows.current[i]}
                    onClick={() => setActiveRow(i)}
                  >
                    {headers.map((key: string, idx: number) => {
                      if (data.schema[key] && data.schema[key]._isSchemaRef)
                        return <td key={idx}>Schema Object</td>;

                      if (Array.isArray(data.schema[key]))
                        return <td key={idx}>Array</td>;

                      return (
                        <td className={idx === 0 ? "idx-column" : ""} key={idx}>
                          <span> {idx === 0 ? i : row[key].toString()}</span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div></div>
  );
};

id.getInitialProps = async ({ query, res }) => {
  const { id }: { id: string } = query;
  if (id == "favicon.ico") return { data: undefined };

  const data = await axios({
    method: "GET",
    url: `http://localhost:3001/api/getData/${id}`,
  }).then((res) => {
    return res.data;
  });
  if (res.err) return { data: undefined };
  return { data };
};

export default id;
