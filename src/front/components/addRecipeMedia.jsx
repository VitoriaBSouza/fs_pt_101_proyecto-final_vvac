
export const AddRecipeMedia = ({ images, setImages }) => {

    const updateImageUrl = (index, value) => {
        const updated = [...images];
        updated[index] = { url: value.trim(), file: null, preview: value.trim() || "" };
        setImages(updated);
    };

    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result; // base64 string
            const updated = [...images];
            updated[index] = { url: base64Image, file, preview: base64Image };
            setImages(updated);
        };
        reader.readAsDataURL(file);
    };

    const addImage = () => {
        if (
            images.length === 0 ||
            (images[images.length - 1].url || images[images.length - 1].file)
        ) {
            if (images.length < 5) {
                setImages([...images, { url: "", file: null, preview: "" }]);
            }
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className="col-12 col-md-6">
            {images.length === 0 && (
                <button
                    type="button"
                    className="btn btn-outline-success mb-2 m-2 d-flex"
                    onClick={addImage}
                >
                    <i className="fa-solid fa-plus mt-2 me-2"></i>
                    <p className="fs-4">Add Image</p>
                </button>
            )}

            {images.map((img, idx) => (
                <div
                    key={idx}
                    className="rct-recipe-image-upload col-12 col-md-6 d-flex flex-column align-items-center align-items-md-start"
                >
                    <img
                        src={img.preview || "https://placehold.co/600x400?text=Add+Your+Image"}
                        alt="Finished dish"
                        className="rct-recipe-main-image"
                    />
                    <div className="rct-image-upload-mask p-2 pt-4">
                        <input
                            type="text"
                            placeholder="Paste image URL"
                            value={img.url}
                            onChange={(e) => updateImageUrl(idx, e.target.value)}
                            className="form-control mb-2"
                        />
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={(e) => handleFileChange(idx, e)}
                            className="form-control mb-2"
                        />
                        {images.length > 1 && (
                            <button
                                type="button"
                                className="btn btn-outline-danger mb-2"
                                onClick={() => removeImage(idx)}
                            >
                                <i className="fa-solid fa-minus"></i>
                            </button>
                        )}
                        {idx === images.length - 1 && images.length < 5 && (
                            <button
                                type="button"
                                className="btn btn-outline-success mb-2"
                                onClick={addImage}
                            >
                                <i className="fa-solid fa-plus"></i> Add Image
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
