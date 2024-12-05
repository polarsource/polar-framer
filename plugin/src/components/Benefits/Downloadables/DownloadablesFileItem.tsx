import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AudioFileOutlined,
  DescriptionOutlined,
  FolderZipOutlined,
  ImageOutlined,
  InsertDriveFileOutlined,
  MoreVertOutlined,
  VideoFileOutlined,
} from "@mui/icons-material";
import { FileRead } from "@polar-sh/sdk/models/components";
import { Switch } from "@/components/ui/switch";
import {
  FocusEvent,
  FormEventHandler,
  useCallback,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { usePatchFile, useDeleteFile } from "@/hooks/files";
import { FileObject } from "@/components/Files/FileUpload";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMemo } from "react";

const FileUploadProgress = ({ file }: { file: FileObject }) => {
  const pct = Math.round((file.uploadedBytes / file.size) * 100);
  return (
    <>
      <div className="flex w-full items-center space-x-4">
        <div className="flex-grow">
          <div className="h-2 w-full rounded bg-neutral-500">
            <div
              className="h-2 rounded bg-blue-400"
              style={{ width: `${pct}%` }}
            >
              &nbsp;
            </div>
          </div>
        </div>
        <div className="flex w-8">
          <p className="text-sm">{pct}%</p>
        </div>
      </div>
    </>
  );
};

const FilenameEditor = ({
  name,
  className,
  enabled,
  onUpdate,
}: {
  name: string;
  className?: string;
  enabled: boolean;
  onUpdate: (updated: string) => void;
}) => {
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const [isDirty, setIsDirty] = useState(false);

  // Mimic macOS behavior when editing a filename.
  // Highlighting everything except extension.
  const selectNameBeforeExtension = (e: FocusEvent<HTMLParagraphElement>) => {
    const range = document.createRange();
    const textNode = e.target.firstChild;
    if (!textNode) return;

    const text = e.target.innerText;
    range.setStart(textNode, 0);

    const extensionIndex = text.lastIndexOf(".");
    const ending = extensionIndex > 0 ? extensionIndex : text.length;
    range.setEnd(textNode, ending);

    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const update = useCallback(
    (updated: string) => {
      if (isDirty) {
        onUpdate(updated);
      }
    },
    [onUpdate, isDirty]
  );

  const onBlur: FormEventHandler<HTMLParagraphElement> = useCallback(
    (e) => {
      if (!paragraphRef.current) return;
      setIsDirty(false);
      const updated = (e.target as HTMLParagraphElement).innerText ?? "";
      update(updated);
    },
    [update]
  );

  const onEditableChanged: FormEventHandler<HTMLParagraphElement> = () => {
    if (!paragraphRef.current) return;
    setIsDirty(true);
  };

  return (
    <>
      <div className={twMerge("flex flex-row", className)}>
        <p
          ref={paragraphRef}
          className="text-xs"
          suppressContentEditableWarning
          contentEditable={enabled}
          onFocus={(e) => {
            selectNameBeforeExtension(e);
          }}
          onBlur={onBlur}
          onKeyDown={(e) => {
            onEditableChanged(e);
            if (e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
        >
          {name}
        </p>
      </div>
    </>
  );
};

const FileUploadDetails = ({ file }: { file: FileObject }) => {
  return <p className="text-xs text-neutral-500">{file.sizeReadable}</p>;
};

export const FileListItem = ({
  file,
  updateFile,
  removeFile,
  archivedFiles,
  setArchivedFile,
  sortable,
}: {
  file: FileObject;
  updateFile: (callback: (prev: FileObject) => FileObject) => void;
  removeFile: () => void;
  archivedFiles: { [key: string]: boolean };
  setArchivedFile: (fileId: string, disabled: boolean) => void;
  sortable?: ReturnType<typeof useSortable>;
}) => {
  // Re-introduce later for editing files, e.g version and perhaps even name?
  const patchFileQuery = usePatchFile(file.id, (response: FileRead) => {
    updateFile((prev: FileObject) => {
      return {
        ...prev,
        ...response,
      };
    });
  });

  const patchFile = useCallback(
    async (attrs: { name?: string; version?: string }) => {
      await patchFileQuery.mutateAsync(attrs);
    },
    [patchFileQuery]
  );

  const deleteFile = useDeleteFile(file.id, () => {
    removeFile();
  });

  const onToggleEnabled = useCallback(
    (enabled: boolean) => {
      setArchivedFile(file.id, !enabled);
    },
    [file, setArchivedFile]
  );

  const onDelete = useCallback(async () => {
    deleteFile.mutateAsync();
  }, [deleteFile]);

  const onCopySHA = useCallback(() => {
    navigator.clipboard.writeText(file.checksumSha256Hex ?? "");
  }, [file]);

  const isUploading = useMemo(() => file.isUploading, [file]);

  const isEnabled = useMemo(() => {
    return archivedFiles ? !archivedFiles[file.id] : true;
  }, [archivedFiles, file]);

  const update = useCallback(
    (attrs: { name?: string; version?: string }) => {
      patchFile(attrs);
    },
    [patchFile]
  );

  return (
    <div
      ref={sortable ? sortable.setNodeRef : undefined}
      className={twMerge(
        "hover:bg-neutral-800 bg-neutral-900 text-neutral-500 flex flex-row items-center justify-between gap-x-8 gap-y-2 rounded-xl px-3 py-2 transition-colors",
        sortable?.isDragging && "opacity-30"
      )}
      style={
        sortable
          ? {
              transform: CSS.Transform.toString(sortable.transform),
              transition: sortable.transition,
            }
          : {}
      }
    >
      <div className="flex w-full min-w-0 flex-row items-center gap-x-4">
        <div className="flex w-full min-w-0 flex-grow flex-col gap-y-1 text-white">
          <FilenameEditor
            name={file.name}
            className="text-sm font-medium"
            onUpdate={(updated) => update({ name: updated })}
            enabled={file.isUploaded ?? false}
          />
          {!isUploading && <FileUploadDetails file={file} />}
          {isUploading && <FileUploadProgress file={file} />}
        </div>
      </div>
      {!isUploading && (
        <div className="flex w-fit flex-row items-center gap-x-2">
          <Switch
            className="p-0.5 h-4 w-8 [&>span]:h-3 [&>span]:w-3"
            checked={isEnabled}
            onCheckedChange={onToggleEnabled}
          />
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none w-6 h-6" asChild>
              <Button
                className={
                  "border-none text-[16px] opacity-50 transition-opacity hover:opacity-100 bg-transparent"
                }
                size="icon"
                variant="secondary"
              >
                <MoreVertOutlined fontSize="inherit" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-neutral-800 shadow-lg"
            >
              {file.checksumSha256Hex && (
                <>
                  <DropdownMenuItem onClick={onCopySHA}>
                    Copy SHA256 Checksum
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export const DraggableFileListItem = ({
  file,
  updateFile,
  removeFile,
  archivedFiles,
  setArchivedFile,
}: {
  file: FileObject;
  updateFile: (callback: (prev: FileObject) => FileObject) => void;
  removeFile: () => void;
  archivedFiles: { [key: string]: boolean };
  setArchivedFile: (fileId: string, disabled: boolean) => void;
}) => {
  const sortable = useSortable({ id: file.id });

  return (
    <FileListItem
      file={file}
      updateFile={updateFile}
      removeFile={removeFile}
      archivedFiles={archivedFiles}
      setArchivedFile={setArchivedFile}
      sortable={sortable}
    />
  );
};
