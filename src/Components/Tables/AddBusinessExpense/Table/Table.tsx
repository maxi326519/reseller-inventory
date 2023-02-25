import "react-data-grid/lib/styles.css";

interface Props {
  rows: Array<{
    description: string;
    amount: string;
    price: string;
    status: string;
    id: string;
  }>;
}

export default function Table({ rows }: Props) {
  return (
    <table /* className={style.table} */>
      <thead>
        <tr>
          <td>description</td>
          <td>amount</td>
          <td>price</td>
          <td>status</td>
          <td>id</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <label htmlFor="1">label</label>
{/*             <textarea id="1" ></textarea> */}
          </td>
          <td>amount</td>
          <td>price</td>
          <td>status</td>
          <td>id</td>
        </tr>
        <tr>
          <td>
            <label htmlFor="1">label</label>
            <input id="1" />
          </td>
          <td>amount</td>
          <td>price</td>
          <td>status</td>
          <td>id</td>
        </tr>
      </tbody>
    </table>
  );
}
