import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./FileInput.module.css";

const FileInput = ({ onFileDrop }) => {
    const onDrop = useCallback(
        (acceptedFiles) => {
            onFileDrop(acceptedFiles);
        },
        [onFileDrop]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <div className={styles.dropzone} {...getRootProps()}>
            <input className={styles.dropzoneInput} {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the files here ...</p>
            ) : (
                <p>Drag and drop a file here, or click to select a file</p>
            )}
        </div>
    );
};

export default FileInput;
