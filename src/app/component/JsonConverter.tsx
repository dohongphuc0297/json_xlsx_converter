"use client"
import { Button, Upload } from "antd";
import * as xlsx from 'xlsx';

export function JsonConverter({ }) {
    const jsonConvertDummyRequest = async (options: { file: any; onSuccess?: any; onError?: any; onProgress?: any }) => {
        const { onSuccess, onError, file, onProgress } = options;

        let _json = file as Blob;

        const fileReader = new FileReader();
        fileReader.readAsText(_json, "UTF-8");
        fileReader.onload = e => {
            const jsonRaw = e.target?.result as string ?? '';
            // console.log("e.target.result", jsonRaw);
            const _sheet: string[][] = [];
            const json = JSON.parse(jsonRaw);
            Object.keys(json).forEach((key) => {
                const value = json[key];
                // console.log(key, ': ', json[key]);
                if (typeof value === 'string' || value instanceof String) {
                    _sheet.push([key, `${value}`])
                } else {
                    // console.log(value);
                    const data = value as { [key: string]: string };
                    const dataKeys = Object.keys(data);
                    const _object: string[][] = [];

                    dataKeys.forEach(function (key2) {
                        _object.push([key2, `${data[key2]}`])
                    });

                    _sheet.push([key, `#Object_${dataKeys.length}`]);
                    _sheet.push(..._object);
                }
            });
            try {
                const wb = xlsx.utils.book_new();
                const ws = xlsx.utils.aoa_to_sheet(_sheet);
                xlsx.utils.book_append_sheet(wb, ws, 'json_converted');
                xlsx.writeFile(wb, 'json_converted.xlsx');
            } catch (error) {
                console.log(error);
            }
        };

        try {
            onSuccess('Ok');
        } catch (err) {
            onError({ err });
        }
    };

    return (
        <Upload accept="application/json" maxCount={1} customRequest={jsonConvertDummyRequest} listType="picture">
            <Button>Click to Convert json to xlsx</Button>
        </Upload>
    );
}