"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    setFiles(storedFiles);
  }, []);

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  const closeModal = () => {
    setSelectedFile(null);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
        <Link href="/upload" className="inline-flex items-center gap-2 ring-1 rounded-md px-4 py-2 font-bold text-xl bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Upload
        </Link>
     
      <h1 className="text-4xl font-bold mt-8 mb-6 text-gray-800">Uploaded Files</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.length > 0 ? (
          files.map((file) => (
            <div
              key={file.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleFileClick(file)}
            >
              {file.type.startsWith('image/') && (
                <img src={file.url} alt={file.description} className="w-full h-48 object-cover" />
              )}
              {file.type === 'video/mp4' && (
                <video controls className="w-full h-48">
                  <source src={file.url} type="video/mp4" />
                </video>
              )}
              {(file.type === 'model/obj' || file.type === 'model/fbx') && (
                <div className="w-full h-48 bg-gray-200">
                  <Canvas>
                    <OrbitControls />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[0, 0, 5]} />
                    {file.type === 'model/obj' && (
                      <ModelLoader url={file.url} loaderType="obj" />
                    )}
                    {file.type === 'model/fbx' && (
                      <ModelLoader url={file.url} loaderType="fbx" />
                    )}
                  </Canvas>
                </div>
              )}
              <p className="p-4 text-gray-600">{file.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No files uploaded yet.</p>
        )}
      </div>

      {selectedFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleModalClick}
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg w-full">
            <div className="p-4">
              <button
                className="text-gray-500 hover:text-gray-700 float-right"
                onClick={closeModal}
              >
                &#x2715; {/* Close icon */}
              </button>
              <h2 className="text-2xl font-bold mb-4">{selectedFile.description}</h2>
              {selectedFile.type.startsWith('image/') && (
                <img src={selectedFile.url} alt={selectedFile.description} className="w-full h-auto mb-4 rounded-lg" />
              )}
              {selectedFile.type === 'video/mp4' && (
                <video controls className="w-full h-auto mb-4 rounded-lg">
                  <source src={selectedFile.url} type="video/mp4" />
                </video>
              )}
              {(selectedFile.type === 'model/obj' || selectedFile.type === 'model/fbx') && (
                <Canvas className="w-full h-64">
                  <OrbitControls />
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[0, 0, 5]} />
                  {selectedFile.type === 'model/obj' && (
                    <ModelLoader url={selectedFile.url} loaderType="obj" />
                  )}
                  {selectedFile.type === 'model/fbx' && (
                    <ModelLoader url={selectedFile.url} loaderType="fbx" />
                  )}
                </Canvas>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModelLoader({ url, loaderType }) {
  const [model, setModel] = useState(null);

  useEffect(() => {
    const loader = loaderType === 'obj' ? new OBJLoader() : new FBXLoader();
    loader.load(url, setModel);
  }, [url, loaderType]);

  return model ? <primitive object={model} /> : null;
}
