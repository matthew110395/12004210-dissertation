import React from 'react'

function Table({ headers, data, addClass }) {
    return (
        <div className="table-responsive">
            <table className={`table  ${addClass}`}>
            <thead>
                <tr>
                    {headers.map(heading => {
                        return <th key={`${heading.col}_head`}>{heading.title}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => {
                    return <tr key={index}>
                        {headers.map((key, index) => {
                            return <td key={row[key.col]}>{row[key.col]}</td>
                        })}
                    </tr>;
                })}
            </tbody>
        </table>
        </div>
    )
}

export default Table