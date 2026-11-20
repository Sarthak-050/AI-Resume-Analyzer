import API from "./api";

export const uploadResume = async (file, versionOf = null) => {
  const formData = new FormData();

  formData.append("resume", file);

  if (versionOf) {
    formData.append("versionOf", versionOf);
  }

  const { data } = await API.post(
    "/resume/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const getMyResumes = async () => {
  const { data } = await API.get("/resume");
  return data;
};

export const deleteResume = async (id) => {
  const { data } = await API.delete(`/resume/${id}`);
  return data;
};

export const getResumeById = async (id) => {
  const { data } = await API.get(`/resume/${id}`);
  return data;
};

export const matchResumeWithJD = async (id, jobDescription) => {
  const { data } = await API.post(`/resume/${id}/match`, {
    jobDescription,
  });
  return data;
};

export const rewriteResumeText = async (id, text) => {
  const { data } = await API.post(`/resume/${id}/rewrite`, {
    text,
  });
  return data;
};

export const getVersionHistory = async (id) => {
  const { data } = await API.get(`/resume/${id}/versions`);
  return data;
};

export const getPanelReview = async (id) => {
  const { data } = await API.post(`/resume/${id}/panel-review`);
  return data;
};

export const generateFixedResume = async (id) => {
  const { data } = await API.post(`/resume/${id}/fix`);
  return data;
};