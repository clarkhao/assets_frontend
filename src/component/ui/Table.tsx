/** @jsxImportSource @emotion/react */
//应用
import React, { Fragment } from "react";
import { useStore } from "../../store";
import { API_URL, db, PUBLIC_TOKEN, objectToURLSearchParams } from "../utils";
import axios from "axios";
//style
import style from "./Table.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import Avatar from "./Avatar";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  CellContext,
  ColumnDefTemplate,
  PaginationState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import TablePagination from "@mui/material/TablePagination";

interface TableMeta<TUser> {
  updateData: (rowIndex: number, columnId: string, value: string) => void;
  revertData: (rowIndex: number, revert: boolean, save: boolean) => void;
  selectedRow: Record<string, any>;
  setSelectedRow: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

type ColumnMeta<TUser, T> = {
  type: T;
};

const EditableCell = ({
  getValue,
  row,
  column,
  table,
  ...cxt
}: CellContext<TUser, any>): ColumnDefTemplate<CellContext<TUser, any>> => {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = React.useState(initialValue);
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  const onBlur = () => {
    (tableMeta as TableMeta<TUser>)?.updateData(row.index, column.id, value);
  };
  if ((tableMeta as TableMeta<TUser>)?.selectedRow[row.id]) {
    switch ((columnMeta as ColumnMeta<TUser, string>)?.type) {
      case "number":
        return (
          <input
            key={`input_${row.id}`}
            style={{ width: "80px", height: "30px", fontSize: "16px" }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            type={(columnMeta as ColumnMeta<TUser, string>)?.type || "text"}
          />
        ) as any;
        break;
      case "checkbox":
        return ["user", "admin", "root"].map((item, index) => {
          return (
            <Fragment key={`role_${row.id}_check${index}`}>
              <input
                type="checkbox"
                key={`${index}_${row.id}`}
                name={item}
                checked={value.includes(item)}
                onBlur={onBlur}
                onChange={(e) => {
                  if (e.target.checked) {
                    setValue([...value, item]);
                  } else {
                    setValue(
                      (value as Array<string>).filter((el) => el !== item)
                    );
                  }
                }}
              />
              <label htmlFor={item} key={`label_${index}_${row.id}`}>
                {item}
              </label>
            </Fragment>
          );
        }) as any;
        break;
      default:
        return (<span key={`span_${row.id}`}>{value}</span>) as any;
        break;
    }
  } else {
    switch ((columnMeta as ColumnMeta<TUser, string>)?.type) {
      case "checkbox":
        return ["user", "admin", "root"].map((item, index) => {
          return (
            <Fragment key={`role_${row.id}_${index}`}>
              <label
                htmlFor={item}
                style={{
                  marginRight: "15px",
                  color: `${value.includes(item) ? "red" : ""}`,
                }}
              >
                {item}
              </label>
            </Fragment>
          );
        }) as any;
        break;
      default:
        return (<span key={`span_${row.id}`}>{value}</span>) as any;
    }
  }
};

const EditAction = ({
  row,
  table,
  ...cxt
}: CellContext<TUser, any>): ColumnDefTemplate<CellContext<TUser, any>> => {
  const meta = table.options.meta;
  const setSelectedRow = (e: React.MouseEvent<HTMLButtonElement>) => {
    (meta as TableMeta<TUser>)?.setSelectedRow((old) => ({
      ...old,
      [row.id]: !old[row.id],
    }));
    (meta as TableMeta<TUser>)?.revertData(
      row.index,
      (e.target as React.ButtonHTMLAttributes<HTMLButtonElement>).name ===
        "cancel",
      (e.target as React.ButtonHTMLAttributes<HTMLButtonElement>).name ===
        "save"
    );
  };
  return (meta as TableMeta<TUser>)?.selectedRow[row.id]
    ? ((
        <>
          <button onClick={setSelectedRow} name="cancel">
            X
          </button>{" "}
          <button onClick={setSelectedRow} name="save">
            ✔
          </button>
        </>
      ) as any)
    : ((<button onClick={setSelectedRow}>✐</button>) as any);
};

type TUser = {
  app: string;
  avatar: string;
  createdTime: string;
  email: string;
  id: string;
  limit: number;
  name: string;
  owner: string;
  publicUser: string;
  role: Array<string>;
};
const initUser = {
  app: "",
  avatar: "",
  createdTime: "",
  email: "",
  id: "",
  limit: 0,
  name: "",
  owner: "",
  publicUser: "",
  role: [],
};
type User = {
  id: string;
  limit: number;
  role: Array<string>;
};
const columnHelper = createColumnHelper<TUser>();
const columns = [
  columnHelper.accessor("avatar", {
    header: "头像",
    cell: (info) => (
      <Avatar
        size={50}
        iconUrl={info.getValue()}
        handleClick={() => console.log(info)}
      />
    ),
  }),
  columnHelper.accessor("email", {
    header: "邮箱",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("limit", {
    header: "上传上限",
    cell: EditableCell,
    meta: {
      type: "number",
    },
  }),
  columnHelper.accessor("name", {
    header: "用户名",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("role", {
    header: "角色",
    cell: EditableCell,
    meta: {
      type: "checkbox",
    },
  }),
  columnHelper.display({
    id: "edit",
    cell: EditAction,
  }),
];
type TTable = {};

function Table({ ...props }: TTable) {
  const [data, setData] = React.useState<Array<TUser>>(
    new Array(10).fill(initUser)
  );
  const [originalData, setOriginalData] = React.useState<Array<TUser>>(data);
  const [selectedRow, setSelectedRow] = React.useState({});
  const [token, _] = React.useState<string | null>(
    sessionStorage.getItem("token")
  );
  const userCache = sessionStorage.getItem("user");
  const themeMode = useStore((state) => state.themeMode);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      selectedRow,
      setSelectedRow,
      revertData: (rowIndex: number, revert: boolean, save: boolean) => {
        if (revert) {
          setData((old) =>
            old.map((row, index) => {
              return index === rowIndex ? originalData[rowIndex] : row;
            })
          );
        } else if (save) {
          if (
            JSON.stringify(originalData[rowIndex]) !==
            JSON.stringify(data[rowIndex])
          ) {
            const user: User = {
              id: data[rowIndex].id,
              limit: data[rowIndex].limit,
              role: data[rowIndex].role,
            };
            axios({
              url: `${API_URL}/api/user`,
              method: "PUT",
              data: JSON.stringify(user),
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            })
              .then((res) => {
                if(res.status < 400) {
                  const cacheUserId = (JSON.parse(userCache!) as TUser).publicUser
                  if(user.id.split(":")[1]  === cacheUserId) {
                    const newCache = {...(res.data as Omit<TUser, "id">), publicUser: cacheUserId};
                    sessionStorage.setItem("user", JSON.stringify(newCache));
                  }
                }
                return res.data as Omit<TUser, "id">;
              })
              .then((data) => {
                setData((old) =>
                  old.map((row, index) => {
                    return index === rowIndex
                      ? { ...data, id: `user:${data.publicUser.split(":")[1]}` }
                      : row;
                  })
                );
              })
              .catch((err) => console.log(err));
          }
        } else {
          setOriginalData((old) => {
            return old.map((row, index) => {
              return index === rowIndex ? data[rowIndex] : row;
            });
          });
        }
      },
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  const [page, setPage] = React.useState(0);

  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  React.useEffect(() => {
    table.setPageIndex(page);
  }, [page]);

  React.useEffect(() => {
    db.authenticate(PUBLIC_TOKEN).then(async () => {
      await db.use({ ns: "test", db: "test" });
      const query = (
        await db.query(`
        select * from user order by publicUser limit 6;
      `)
      )[0].result as Array<TUser>;
      setData(query);
      setOriginalData(query);
    });
    //test
    /*
    axios({
      url: "https://641b10fb9b82ded29d494d1c.mockapi.io/api/posts/user",
      method: "GET",
    })
      .then((res) => {
        setData(res.data);
        setOriginalData(res.data);
      })
      .catch((err) => console.log(err));
      */
  }, []);

  return (
    <div
      className={[style.container, `${themeMode}-container`].join(" ")}
      css={css`
        --even-row-bg: ${themeMode === "light" ? "#f9f9f9" : "#222222"};
      `}
    >
      <div className={style.table}>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
}

export default Table;
