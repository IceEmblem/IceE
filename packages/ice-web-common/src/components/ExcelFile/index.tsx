import * as XLSX from 'xlsx';

export function exportXLSX(data: any, header?: string[], exportFileName?: string) {
    let sheet = XLSX.utils.json_to_sheet(data, {
        header: header
    });

    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet);

    XLSX.writeFileXLSX(wb, exportFileName || 'export.xlsx');
}