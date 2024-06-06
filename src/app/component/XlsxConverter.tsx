"use client"
import { Button, Upload } from "antd";

export function XlsxConverter({ }) {
    const xlsxConvertDummyRequest = async (options: { file: any; onSuccess?: any; onError?: any; onProgress?: any }) => {
        const { onSuccess, onError, file, onProgress } = options;

        let _xlsx = file as Blob;

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