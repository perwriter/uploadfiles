"use client";

import { useState } from 'react';

export default function Upload() {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (file) {
      const newFile = {
        id: Date.now(),
        type: file.type,
        url: URL.createObjectURL(file),
        description,
      };

      const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
      localStorage.setItem('uploadedFiles', JSON.stringify([...storedFiles, newFile]));

      // Redirect to the homepage
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">Upload a File</h1>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.mp4,.obj,.fbx"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <textarea
        className="mb-4 p-2 border rounded"
        placeholder="Enter a description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload
      </button>
    </div>
  );
}
