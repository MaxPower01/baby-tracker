import { Box, Button, ImageList, ImageListItem, Modal } from "@mui/material";
import React, { useCallback, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { LinearProgressWithLabel } from "@/components/LinearProgressWithLabel";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { storage } from "@/firebase";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";

type Props = {
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ImagesInput(props: Props) {
  const { user } = useAuthentication();
  const [progress, setProgress] = useState(0);
  const inputId = "images-input-upload";

  const handleInputClick = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (props.isUploading) return;
      const files = event.target.files;
      if (files == null || files.length === 0) return;

      const totalSize = Array.from(files).reduce(
        (acc, file) => acc + file.size,
        0
      );
      let totalUploaded = 0;

      props.setIsUploading(true);
      setProgress(0);

      const uploadPromises = Array.from(files).map((file) => {
        return new Promise<void>((resolve, reject) => {
          const storageRef = ref(
            storage,
            `child/${user?.babyId ?? ""}/images/${file.name}` // TODO: Eventually, rename "child" to "baby"
          );
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const fileProgress =
                snapshot.bytesTransferred / snapshot.totalBytes;
              totalUploaded +=
                fileProgress * file.size -
                totalUploaded * (file.size / totalSize);
              const overallProgress = (totalUploaded / totalSize) * 100;
              setProgress(overallProgress);
            },
            (error) => {
              console.error(error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                  props.setImageUrls((prevImageUrls) => [
                    ...prevImageUrls,
                    downloadURL,
                  ]);
                })
                .finally(() => resolve());
            }
          );
        });
      });

      try {
        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("An error occurred during the upload", error);
      } finally {
        props.setIsUploading(false);
        setProgress(100); // Optionally set progress to 100% here, or adjust based on actual completion
      }
    },
    [props.isUploading, user]
  );

  const [modalImageURL, setModalImageURL] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setModalImageURL(imageUrl);
  };

  const handleCloseModal = () => {
    setModalImageURL(null);
  };

  return (
    <>
      {props.isUploading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgressWithLabel value={progress} />
        </Box>
      )}
      <input
        id={inputId}
        type="file"
        accept="image/*"
        multiple={true}
        onChange={async (e) => await handleInputClick(e)}
        style={{ display: "none" }}
      />
      <label htmlFor={inputId}>
        <Button
          variant="outlined"
          onClick={() => {
            if (document && document.getElementById) {
              const input = document.getElementById(inputId);
              if (input) {
                input.click();
              }
            }
          }}
        >
          Ajouter une image
        </Button>
      </label>
      {(props.imageUrls?.length ?? 0) > 0 && (
        <ImageList>
          {props.imageUrls.map((imageURL, index) => {
            return (
              <ImageListItem
                key={`${index}-${imageURL}`}
                sx={{
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                }}
                onClick={() => handleImageClick(imageURL)}
              >
                <img src={`${imageURL}`} loading="lazy" />
              </ImageListItem>
            );
          })}
        </ImageList>
      )}

      <Modal
        open={modalImageURL !== null}
        onClose={handleCloseModal}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            outline: "none",
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <img
            src={modalImageURL ?? ""}
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
      </Modal>
    </>
  );
}
