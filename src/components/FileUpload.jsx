import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import FilePreview from './FilePreview'
import FileInfo from './FileInfo'

export default function FileUpload() {
    const [file, setFile] = useState(null)
    const [fileInfo, setFileInfo] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState(null)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [isUploaded, setIsUploaded] = useState(false)
    const [retry, setRetry] = useState(false)

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        if (!file.type.startsWith('image/')) {
            setError('Solo se permiten archivos de imagen (JPG, PNG)')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('El archivo no debe superar los 5MB')
            return
        }
        setFile(file)
        setError(null)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*,application/pdf',
        maxFiles: 1
    })

    const handleUpload = async () => {
        if (!file) return

        setIsUploading(true)
        setError(null)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch('https://voucherreaderback.onrender.com/vouchers/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor')
            }

            const result = await response.json()
            console.log(result)
            if (result.success) {
                setFileInfo(result.data)
                setIsUploaded(true)
            } else {
                if (result.message === "Información Soportada no Encontrada (nombre, monto, fecha y número de operación)" && !retry) {
                    setRetry(true)
                    handleUpload()
                } else {
                    setError(result.message)
                }
            }
        } catch (uploadError) {
            if (uploadError.name === 'TypeError') {
                setError('No se pudo conectar con el servidor. Por favor, inténtelo de nuevo más tarde.')
            } else {
                setError(uploadError.message || 'Error al subir el archivo')
            }
        } finally {
            setIsUploading(false)
        }
    }

    const handleSave = async () => {
        if (!fileInfo) return

        const fileInfoText = `
                Nombre: ${fileInfo.name}
                Monto: ${fileInfo.amount}
                Fecha: ${fileInfo.date}
                Número de operación: ${fileInfo.operationNumber}
        `

        try {
            await navigator.clipboard.writeText(fileInfoText)
            alert('Información copiada al portapapeles exitosamente')

            const response = await fetch('https://voucherreaderback.onrender.com/vouchers/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fileInfo)
            })

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor')
            }

            const result = await response.json()
            console.log(result)
            if (!result.success) {
                setError(result.message)
            }
        } catch (error) {
            setError('Error al copiar la información al portapapeles')
        }
    }

    const handleRemove = () => {
        setFile(null)
        setFileInfo(null)
        setError(null)
        setIsUploaded(false)
        setRetry(false)
    }

    const handlePreviewClick = () => {
        setIsPreviewOpen(true)
    }

    const handleClosePreview = () => {
        setIsPreviewOpen(false)
    }

    return (
        <div className="w-full max-w-4xl mx-auto mt-10">
            {!isUploaded ? (
                <div>
                    {!file ? (
                        <div className="flex items-center justify-center w-full">
                            <div
                                {...getRootProps()}
                                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition duration-500 ${
                                    isDragActive ? 'bg-gray-100 dark:bg-gray-600' : ''
                                }`}
                            >
                                <input {...getInputProps()} className="hidden" />
                                <Upload className="mx-auto h-12 w-12 text-gray-400 transition-transform duration-500 transform hover:scale-110" />
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 p-10">
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Arrastra y suelta un archivo aquí,</span> o haz clic para seleccionar un archivo
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Soporta: JPG, PNG, PDF (MAX. 5MB)</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 transition-opacity duration-500 ease-in-out opacity-100">
                            <p className="text-sm font-medium">Archivo seleccionado:</p>
                            <p className="text-sm text-gray-500">{file.name}</p>
                            <div className="mt-2 h-64 w-full border rounded-lg overflow-hidden transition-transform duration-500 transform hover:scale-105 cursor-pointer" onClick={handlePreviewClick}>
                                {file.type.startsWith('image/') ? (
                                    <img src={URL.createObjectURL(file)} alt="Vista previa" className="w-full h-full object-contain" />
                                ) : (
                                    <embed src={URL.createObjectURL(file)} type="application/pdf" className="w-full h-full" />
                                )}
                            </div>
                            <div className="flex justify-between mt-2">
                                <button
                                    onClick={handleRemove}
                                    className="w-1/2 bg-[#E3E4DB] text-[#797B84] py-2 rounded transition-colors duration-500 hover:bg-[#D1D3C5] mr-2 flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z" />
                                    </svg>
                                    Remover
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="w-1/2 bg-[#797B84] text-[#E3E4DB] py-2 rounded transition-colors duration-500 hover:bg-[#6b6d75] ml-2 flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                    </svg>
                                    {isUploading ? 'Extrayendo...' : 'Extraer'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FilePreview file={file} onPreviewClick={handlePreviewClick} />
                    <FileInfo fileInfo={fileInfo} onRemove={handleRemove} onUpload={handleUpload} isUploading={isUploading} onSave={handleSave} />
                </div>
            )}

            {error && (
                <div className="mt-4 text-red-500">
                    {error}
                </div>
            )}

            {isPreviewOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={handleClosePreview}>
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-0 left-0 m-4 text-white bg-red-500 rounded-full p-1 text-xs" onClick={handleClosePreview}>×</button>
                        <div className="w-full max-w-3xl p-4 bg-white rounded-lg">
                            {file.type.startsWith('image/') ? (
                                <img src={URL.createObjectURL(file)} alt="Vista previa ampliada" className="max-w-md max-h-96 object-contain m-4" />
                            ) : (
                                <embed src={URL.createObjectURL(file)} type="application/pdf" className="w-full h-full" />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}