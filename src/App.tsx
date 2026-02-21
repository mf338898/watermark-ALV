import { useEffect } from 'react';
import { Dropzone } from './components/Dropzone';
import { Preview } from './components/Preview';
import { SettingsPanel } from './components/SettingsPanel';
import { DownloadButton } from './components/DownloadButton';
import { useWatermark } from './hooks/useWatermark';
import './App.css';

function App() {
  const {
    files,
    options,
    setOptions,
    processed,
    progress,
    demoBlob,
    demoLoading,
    loadDemo,
    processFiles,
    handleDownloadZip,
    isReady,
    isProcessing,
  } = useWatermark();

  useEffect(() => {
    if (files.length > 0) {
      processFiles(files, options);
    } else {
      loadDemo(options);
    }
  }, [options, files, processFiles, loadDemo]);

  const handleFiles = (newFiles: File[]) => {
    processFiles(newFiles, options);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-brand">
          <img src="/watermark.svg" alt="ALV Immobilier" className="app-header-logo" />
          <h1 className="app-header-title">Watermark</h1>
        </div>
        <p className="tagline">Importer → voir le watermark → télécharger le ZIP</p>
      </header>

      <div className="split">
        <section className="panel panel-action">
          <Dropzone onFiles={handleFiles} disabled={isProcessing} />
          <p className="status">
            {files.length} fichier{files.length !== 1 ? 's' : ''}
            {files.length > 0 && ` • prêt en ~${Math.ceil(files.length * 1.5)} sec`}
          </p>
          <DownloadButton
            onClick={handleDownloadZip}
            disabled={!isReady}
            progress={progress}
            fileCount={processed.length}
          />
          <SettingsPanel options={options} onChange={setOptions} />
        </section>

        <section className="panel panel-preview">
          <Preview
            processed={processed}
            demoBlob={demoBlob}
            demoLoading={demoLoading}
          />
        </section>
      </div>
    </div>
  );
}

export default App;
