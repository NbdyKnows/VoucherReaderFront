import PropTypes from 'prop-types'

const FilePreview = ({ file, onPreviewClick }) => (
    <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-sm font-medium text-black">Vista previa:</p>
        <div className="mt-2 h-64 w-full border rounded-lg overflow-hidden transition-transform duration-500 transform hover:scale-105 cursor-pointer" onClick={onPreviewClick}>
            {file.type.startsWith('image/') ? (
                <img src={URL.createObjectURL(file)} alt="Vista previa" className="w-full h-full object-contain" />
            ) : (
                <embed src={URL.createObjectURL(file)} type="application/pdf" className="w-full h-full" />
            )}
        </div>
    </div>
)

FilePreview.propTypes = {
    file: PropTypes.shape({
        type: PropTypes.string.isRequired,
    }).isRequired,
    onPreviewClick: PropTypes.func.isRequired,
}

export default FilePreview