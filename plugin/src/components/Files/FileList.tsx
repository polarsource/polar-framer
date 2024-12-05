import { FileObject } from '@/components/Files/FileUpload'
import { useDraggable } from '@/hooks/draggable'
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { DraggableFileListItem, FileListItem } from './FileListItem'
import { ProductMediaFileRead } from '@polar-sh/sdk/models/components'

type ProductMediaFileObject = FileObject<ProductMediaFileRead & { service: "product_media" }>

export const FileList = ({
  files,
  setFiles,
  removeFile,
}: {
  files: ProductMediaFileObject[]
  setFiles: (
    callback: (prev: ProductMediaFileObject[]) => ProductMediaFileObject[],
  ) => void
  removeFile: (fileId: string) => void
}) => {
  const getRemoveScopedFile = (fileId: string) => {
    return () => removeFile(fileId)
  }

  const {
    sensors,
    activeId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useDraggable(
    files,
    (updated) => {
      // convert our setFiles to one without callback
      setFiles(() => updated)
    },
    // @ts-expect-error
    (_: ProductMediaFileObject[]) => {},
  )

  if (files.length === 0) {
    return <></>
  }

  let activeFile = undefined
  if (activeId) {
    activeFile = files.find(
      (file) => file.id === activeId,
    ) as ProductMediaFileObject
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={files} strategy={rectSortingStrategy}>
        {files.map((file) => (
          <DraggableFileListItem
            key={file.id}
            file={file}
            removeFile={getRemoveScopedFile(file.id)}
          />
        ))}
        <DragOverlay adjustScale={true}>
          {activeFile ? (
            <>
              <FileListItem
                file={activeFile}
                removeFile={getRemoveScopedFile(activeFile.id)}
              />
            </>
          ) : null}
        </DragOverlay>
      </SortableContext>
    </DndContext>
  )
}
