import React from 'react'
import '../styles/Table.css'
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs'

function Table({ rows, deleteRow, editRow }) {
    return (
        <div className="table-wrapper">
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Größe</th>
                        <th>Preis</th>
                        <th>Farbe</th>
                        <th>Artikelnummer</th>
                        <th>Menge</th>

                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx}>
                            <td>{row.name}</td>
                            <td>{row.size}</td>
                            <td>{row.price ? row.price.toFixed(2) : '-'}</td>
                            <td>{row.color}</td>
                            <td>{row.sku}</td>
                            <td>{row.stock}</td>

                            <td>
                                <span className="actions">
                                    <BsFillTrashFill className="delete-btn" onClick={() => deleteRow(idx)} />
                                    <BsFillPencilFill className="edit-btn" onClick={() => editRow(idx)} />
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table
