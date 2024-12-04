import { useQuery } from "@tanstack/react-query";

import { useMutation } from "@tanstack/react-query";
import { FileRead } from "@polar-sh/sdk/models/components";
import { useContext } from "react";
import { PolarAPIContext, queryClient } from "@/providers";

export const useFiles = (organizationId: string, fileIds: string[]) => {
  const polar = useContext(PolarAPIContext);

  return useQuery({
    queryKey: ["user", "files", JSON.stringify(fileIds)],
    queryFn: () =>
      polar.files
        .list({
          organizationId,
          ids: fileIds,
        })
        .then((response) => {
          const files = response.result.items.reduce(
            (lookup: Record<string, FileRead>, file) => {
              lookup[file.id] = file;
              return lookup;
            },
            {}
          );
          // Return in given ID order
          const sorted = fileIds
            .map((id) => files?.[id])
            .filter((file) => !!file);
          return {
            items: sorted,
            pagination: response.result.pagination,
          };
        }),
  });
};

export const usePatchFile = (
  id: string,
  onSuccessCallback?: (res: FileRead) => void
) => {
  const polar = useContext(PolarAPIContext);

  return useMutation({
    mutationFn: ({ name, version }: { name?: string; version?: string }) => {
      const patch: {
        name?: string;
        version?: string;
      } = {};
      if (name) {
        patch["name"] = name;
      }
      if (version) {
        patch["version"] = version;
      }

      return polar.files.update({
        id: id,
        filePatch: patch,
      });
    },
    onSuccess: (response: FileRead) => {
      if (onSuccessCallback) {
        onSuccessCallback(response);
      }

      queryClient.invalidateQueries({ queryKey: ["user", "files"] });
    },
  });
};

export const useDeleteFile = (id: string, onSuccessCallback?: () => void) => {
  const polar = useContext(PolarAPIContext);

  return useMutation({
    mutationFn: () => {
      return polar.files.delete({
        id: id,
      });
    },
    onSuccess: () => {
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      queryClient.invalidateQueries({ queryKey: ["user", "files"] });
    },
  });
};
