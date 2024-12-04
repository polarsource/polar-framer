import { AddPhotoAlternateOutlined } from '@mui/icons-material'
import {
  FileRead,
  FileServiceTypes,
  FileUpload,
  Organization,
  ProductMediaFileRead,
} from '@polar-sh/sdk/models/components'
import { ReactElement, useCallback, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import { twMerge } from 'tailwind-merge'
import { FileObject, useFileUpload } from '../Files/FileUpload'
import { FileList } from '../Files/FileList'

const DropzoneView = ({
  isDragActive,
  children,
}: {
  isDragActive: boolean
  children: ReactElement
}) => {
  return (
    <>
      <div
        className={twMerge(
          'flex aspect-video w-full cursor-pointer items-center justify-center rounded-2xl border border-transparent px-4',
          isDragActive
            ? 'dark:border-polar-700 dark:bg-neutral-950 border-blue-100 bg-blue-50'
            : 'dark:border-polar-700  dark:bg-transparent',
        )}
      >
        <div className="dark:text-neutral-500 text-center ">
          <div className="mb-4">
            <AddPhotoAlternateOutlined fontSize="medium" />
          </div>
          <p className="dark:text-neutral-200 text-xs font-medium ">
            {isDragActive ? "Drop it like it's hot" : 'Add product media'}
          </p>
          <p className="mt-2 text-xs">
            Up to 10MB each. 16:9 ratio recommended for optimal display.
          </p>
        </div>
        {children}
      </div>
    </>
  )
}

interface ProductMediasFieldProps {
  organization: Organization
  value: (ProductMediaFileRead & { service: "product_media" })[] | undefined
  onChange: (value: (ProductMediaFileRead & { service: "product_media" })[]) => void
}

const ProductMediasField = ({
  organization,
  value,
  onChange,
}: ProductMediasFieldProps) => {
  const onFilesUpdated = useCallback(
    (files: FileObject<ProductMediaFileRead & { service: "product_media" }>[]) => {
      onChange(files.filter((file) => file.isUploaded))
    },
    [onChange],
  )

  const [filesRejected, setFilesRejected] = useState<FileRejection[]>([])

  const {
    files,
    setFiles,
    removeFile,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useFileUpload({
    organization: organization,
    service: FileServiceTypes.ProductMedia,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': [],
      'image/svg+xml': [],
    },
    maxSize: 10 * 1024 * 1024,
    onFilesUpdated: (files: FileObject<FileRead | FileUpload>[]) => {
      onFilesUpdated(files as FileObject<ProductMediaFileRead & { service: "product_media" }>[])
    },
    onFilesRejected: setFilesRejected,
    initialFiles: value || [],
  })

  return (
    <>
      <div className="grid grid-cols-2 gap-3 [&>div>*]:aspect-video">
        <FileList
          files={files as FileObject<ProductMediaFileRead & { service: "product_media" }>[]}
          setFiles={setFiles as (callback: (prev: FileObject<ProductMediaFileRead & { service: "product_media" }>[]) => FileObject<ProductMediaFileRead & { service: "product_media" }>[]) => void}
          removeFile={removeFile}
        />
        <div {...getRootProps()}>
          <DropzoneView isDragActive={isDragActive}>
            <input {...getInputProps()} />
          </DropzoneView>
        </div>
      </div>
      {filesRejected.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-100 p-4 text-red-800 dark:border-red-800 dark:bg-red-900 dark:text-red-200">
          {filesRejected.map((file) => (
            <p key={file.file.name}>
              {file.file.name} is not a valid image or is too large.
            </p>
          ))}
        </div>
      )}
    </>
  )
}

export default ProductMediasField
