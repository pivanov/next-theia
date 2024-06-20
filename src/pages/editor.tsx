import { useEffect } from 'react';

const Editor = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/theia/index.js'; // Adjust this path to match the Vite output path
    script.async = true;
    script.onload = () => {
      console.log('Theia script loaded successfully');
    };
    script.onerror = (err) => {
      console.error('Failed to load Theia script', err);
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="editor-container">
      <div id="theia-editor" className="h-screen"></div>
    </div>
  );
};

export default Editor;
