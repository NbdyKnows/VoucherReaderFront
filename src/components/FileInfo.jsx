import PropTypes from 'prop-types'

const FileInfo = ({ fileInfo, onRemove, onUpload, isUploading, onSave }) => (
    <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-sm font-medium text-black">Información del archivo:</p>
        <ul className="text-sm text-gray-500">
            <li>Nombre: {fileInfo.name}</li>
            <li>Monto: {fileInfo.amount}</li>
            <li>Fecha: {fileInfo.date}</li>
            <li>Número de operación: {fileInfo.operationNumber}</li>
        </ul>
        <div className="flex justify-between mt-2">
            <button
                onClick={onRemove}
                className="w-1/2 bg-[#E3E4DB] text-[#797B84] py-2 rounded transition-colors duration-500 hover:bg-[#D1D3C5] mr-2 flex items-center justify-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z" />
                </svg>
                Remover
            </button>
            <button
                onClick={onUpload}
                disabled={isUploading}
                className="w-1/2 bg-[#9C7A97] text-white py-2 rounded transition-colors duration-500 hover:bg-[#C2ADBF] ml-2 flex items-center justify-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Actualizar
            </button>
        </div>
        <div className="flex justify-center mt-4">
            <button
                onClick={onSave}
                className="w-1/2 bg-[#538083] text-white py-2 rounded transition-colors duration-500 hover:bg-[#8FB5B7] flex items-center justify-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
                Copiar
            </button>
        </div>
    </div>
)

FileInfo.propTypes = {
    fileInfo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        amount: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        operationNumber: PropTypes.string.isRequired,
    }).isRequired,
    onRemove: PropTypes.func.isRequired,
    onUpload: PropTypes.func.isRequired,
    isUploading: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
}

export default FileInfo