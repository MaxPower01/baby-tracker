import { Box, Button, ImageList, ImageListItem } from "@mui/material";
import React, { useCallback, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { LinearProgressWithLabel } from "./LinearProgressWithLabel";
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
  const inputId = "images-input-upload";
  const [progress, setProgress] = useState(0);

  const uploadImage = useCallback(
    async (image: File) => {
      const selectedChild = user?.selectedChild ?? "";
      if (image == null || isNullOrWhiteSpace(selectedChild)) return;
      const storageRef = ref(
        storage,
        `child/${selectedChild}/images/${image.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, image);
      setProgress(0);
      props.setIsUploading(true);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress function ...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          // Error function ...
          console.error(error);
          props.setIsUploading(false);
        },
        () => {
          // Complete function ...
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              props.setImageUrls((prevImageUrls) => {
                const newImageUrls = [...prevImageUrls, downloadURL];
                return newImageUrls;
              });
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              props.setIsUploading(false);
              setProgress(0);
            });
        }
      );
    },
    [user]
  );

  const handleInputClick = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (props.isUploading) return;
      const files = event.target.files;
      if (files == null || files.length === 0) return;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await uploadImage(file); // This will upload images one after the other, waiting for each to finish before starting the next
      }
    },
    [user, uploadImage]
  );

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
                }}
              >
                <img src={`${imageURL}`} loading="lazy" />
              </ImageListItem>
            );
          })}
        </ImageList>
      )}
    </>
  );
}
