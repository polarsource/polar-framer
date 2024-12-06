import {
  BenefitDownloadablesCreate,
  FileRead,
  FileServiceTypes,
  Organization,
} from '@polar-sh/sdk/models/components'
import { FileUploadOutlined as FileUploadIcon } from '@mui/icons-material'
import { useFiles } from '@/hooks/files'
import { ReactElement, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { FileList } from './DownloadablesFilesList'
import { FileObject, useFileUpload } from '@/components/Files/FileUpload'




const DropzoneView = ({
  isDragActive,
  children,
}: {
  isDragActive: boolean;
  children: ReactElement;
}) => {
  return (
    <>
      <div
        className={twMerge(
          "flex aspect-video w-full cursor-pointer items-center justify-center rounded-2xl dark:bg-neutral-900 bg-neutral-50 px-4"
        )}
      >
        <div className="text-neutral-500 text-center flex flex-col gap-y-3 items-center">
          <FileUploadIcon fontSize="medium" />
          <p className="dark:text-white text-black text-xs font-medium ">
            {isDragActive ? "Drop it like it's hot" : "Feed me some bytes"}
          </p>
          <p className="text-xs text-neutral-500">
            You can drop files here or{" "}
            <a className="text-blue-400">click like a Netscape user</a>
          </p>
        </div>
        {children}
      </div>
    </>
  );
};


const DownloadablesForm = ({
  organization,
  initialFiles,
  initialArchivedFiles,
}: {
  organization: Organization
  initialFiles: FileRead[]
  initialArchivedFiles: { [key: string]: boolean }
}) => {
  const {
    setValue,
    register,
    clearErrors,
    formState: { errors },
  } = useFormContext<BenefitDownloadablesCreate>()

  register('properties.files', {
    minLength: 1,
    required: 'Please upload at least one file',
    validate: {
      notUploading: () =>
        files.filter((file) => !file.isUploaded).length === 0 ||
        'Please wait for all files to finish uploading',
    },
  })

  const [archivedFiles, setArchivedFiles] = useState<{
    [key: string]: boolean
  }>(initialArchivedFiles ?? {})

  const setFormFiles = (formFiles: FileObject[]) => {
    const files = []

    for (const file of formFiles) {
      if (file.isUploaded) {
        files.push(file.id)
      }
    }

    if (files.length > 0) {
      clearErrors('properties.files')
    }

    setValue('properties.files', files)
  }

  const setArchivedFile = (fileId: string, archived: boolean) => {
    setArchivedFiles((prev) => {
      const updated = { ...prev, [fileId]: archived }
      if (!archived) {
        delete updated[fileId]
      }
      setValue('properties.archived', updated)
      return updated
    })
  }

  const {
    files,
    setFiles,
    updateFile,
    removeFile,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useFileUpload({
    organization: organization,
    service: FileServiceTypes.Downloadable,
    onFilesUpdated: setFormFiles,
    initialFiles,
  })

  return (
    <>
      <div {...getRootProps()}>
        <DropzoneView isDragActive={isDragActive}>
          <input {...getInputProps()} />
        </DropzoneView>
      </div>
      <FileList
        files={files}
        setFiles={setFiles}
        updateFile={updateFile}
        removeFile={removeFile}
        archivedFiles={archivedFiles}
        setArchivedFile={setArchivedFile}
      />
      {errors.properties?.files && (
        <p className="text-destructive-foreground text-sm">
          {errors.properties.files.message}
        </p>
      )}
    </>
  )
}

interface DownloadablesBenefitFormProps {
  organization: Organization
  update?: boolean
}

const DownloadablesEditForm = ({
  organization,
}: DownloadablesBenefitFormProps) => {
  const { getValues } = useFormContext<BenefitDownloadablesCreate>()

  const fileIds = getValues('properties.files')
  const archivedFiles = getValues('properties.archived') ?? {}
  const filesQuery = useFiles(organization.id, fileIds)

  const files =
    filesQuery?.data?.items.filter((v): v is FileRead => Boolean(v)) ?? []

  if (filesQuery.isLoading) {
    // TODO: Style me
    return <div>Loading...</div>
  }

  return (
    <DownloadablesForm
      organization={organization}
      initialFiles={files}
      initialArchivedFiles={archivedFiles}
    />
  )
}

export const DownloadablesBenefitForm = ({
  organization,
  update = false,
}: DownloadablesBenefitFormProps) => {
  if (!update) {
    return (
      <DownloadablesForm
        organization={organization}
        initialFiles={[]}
        initialArchivedFiles={{}}
      />
    )
  }

  return <DownloadablesEditForm organization={organization} />
}
