"use client"
import { Button, Upload } from "antd";
import * as xlsx from 'xlsx';

export function XlsxConverter({ }) {
    const xlsxConvertDummyRequest = async (options: { file: any; onSuccess?: any; onError?: any; onProgress?: any }) => {
        const { onSuccess, onError, file, onProgress } = options;

        let _xlsx = file as File;

        try {
            const data = await _xlsx.arrayBuffer();
            const workbook = xlsx.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            const jsonRaw = xlsx.utils.sheet_to_json<string[]>(worksheet, {
                header: 1,
                defval: "",
            });
            // console.log(jsonRaw);
            let _json: { [key: string]: any } = {}

            let _subJson: { [key: string]: any } = {}
            let _tempKey: string | null = null
            let i = 0

            jsonRaw.forEach(row => {
                const _key = row[0]
                const _value = row[1]
                if (i > 0) {
                    i--
                    _subJson[_key] = _value?.replaceAll("\r\n", "\n").replaceAll("\r", "\n")
                    if (i === 0) {
                        if (_tempKey) {
                            _json[_tempKey] = _subJson
                        }
                        _subJson = {}
                        _tempKey = null
                    }
                } else {
                    const _regex = new RegExp(/^#Object_\d+$/g)
                    if (_regex.test(_value)) {
                        const countStr = _value.split('_')[1];
                        const count = Number.parseInt(countStr);
                        _tempKey = _key
                        i = count
                    } else {
                        _json[_key] = _value?.replaceAll("\r\n", "\n").replaceAll("\r", "\n")
                    }
                }
            })
            // console.log(_json);
            // write json to file and save
            const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                JSON.stringify(_json)
              )}`;
              const link = document.createElement("a");
              link.href = jsonString;
              link.download = "data.json";
          
              link.click();
        } catch (error) {

        }

        try {
            onSuccess('Ok');
        } catch (err) {
            onError({ err });
        }
    };

    return (
        <Upload accept="xlsx" maxCount={1} customRequest={xlsxConvertDummyRequest} listType="picture">
            <Button>Click to Convert xlsx to json</Button>
        </Upload>
    );
}