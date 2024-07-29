"use client";

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  CheckCircleIcon,
  CircleArrowDown,
  HammerIcon,
  RocketIcon,
  SaveIcon,
} from "lucide-react";
import useUpload, { StatusText } from "@/hooks/useUpload";
import { useRouter } from "next/navigation";

function FileUploader() {
  const { progress, status, fileId, handleUpload } = useUpload();
  const router = useRouter();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      await handleUpload(file);
    } else {
    }
  }, [handleUpload]);



  const statusIcons: {
    [key in StatusText]: JSX.Element;
  } = {
    [StatusText.UPLOADING]: (
      <RocketIcon className="h-20 w-20 text-indigo-600" />
    ),
    [StatusText.UPLOADED]: (
      <CheckCircleIcon className="h-20 w-20 text-indigo-600" />
    ),
    [StatusText.SAVING]: (
      <SaveIcon className="h-20 w-20 text-indigo-600" />
    ),
    [StatusText.GENERATING]: (
      <HammerIcon className="h-20 w-20 text-indigo-600" />
    ),
  }


  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
        "application/pdf": [".pdf"],
      },
    });


    const uploadInProgress = progress != null && progress >= 0 && progress <= 100;


  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">

      {uploadInProgress && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <div
            className={`radial-progress bg-indigo-300 text-white border-indigo-600 border-4 ${
              progress === 100 && "hidden"
            }`}
            role= 'progressbar'
            style={
              {
                //@ts-ignore
                "--value": progress,
                "--size": "12rem",
                "--thicknes": "1.3rem",
              }
            }
          >
            {progress} %
          </div>

            {
              //@ts-ignore
              statusIcons[status!]
            }

          {/* @ts-ignore */}
          <p className="text-indigo-600 animate-pulse">{status}</p>
        </div>
      )}

      {!uploadInProgress &&(<div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed mt-10 w-[90%] border-indigo-600 text-indigo-600 rounded-2xl h-96 flex items-center justify-center ${
          isFocused || isDragAccept ? "bg-indigo-300" : "bg-indigo-100"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          {isDragActive ? (
            <>
              <RocketIcon className="h-20 w-20 animate-ping" />
              <p>Drop the Files here...</p>
            </>
          ) : (
            <>
              <CircleArrowDown className="h-20 w-20 animate-bounce" />
              <p>Drag n drop some files here, or click to select some files</p>
            </>
          )}
        </div>
      </div>)}
    </div>
  );
}

export default FileUploader;
