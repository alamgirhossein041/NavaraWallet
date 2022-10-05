import axios from 'axios';
import toastr from '../../utils/toastr';

export const googleDriveStoreFile = async (
  accessToken: string,
  fileName: string,
  data: string,
) => {
  try {
    const metadata = {
      name: fileName,
      mimeType: 'text/plain',
    };

    const driveResponse = await axios.post(
      'https://www.googleapis.com/drive/v3/files',
      JSON.stringify(metadata),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const driveResponseJson = await driveResponse.data;
    const fileId = driveResponseJson.id;
    const mediaResponse = await axios.patch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const mediaResponseJson = await mediaResponse.data;
    if (mediaResponseJson.error) {
      throw new Error(mediaResponseJson.error.message);
    }

    return {status: 'success'};
  } catch (error) {
    console.log(error);
    toastr.error('Backup Failed');
    return {status: 'failed'};
  }
};
