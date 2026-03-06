import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { Directory } from '@capacitor/filesystem';
import write_blob from 'capacitor-blob-writer';
import { environment } from 'src/environments/environment';
import { Toast } from '@capacitor/toast';

@Injectable({
  providedIn: 'root'
})

export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    if(environment.keep_login) 
    {
      Toast.show({
        text:"downloading...",
        duration: "short",
      });
      write_blob({
        path: fileName+EXCEL_EXTENSION,
        directory: Directory.Documents,
        blob: data
      }).then(function(x){
        setTimeout(() => {
          Toast.show({
            text: "download completed!",
            duration: "long",
          });
        }, 3000);
      }).catch(function(e){
        console.log(e);
      });
    }   
    else FileSaver.saveAs(data, fileName+EXCEL_EXTENSION);  
  }

}