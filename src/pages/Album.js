import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
require('dotenv').config();

function Album() {

    const params = useParams();
    const [image, setImage] = useState([]);
    const [albumsImages, setAlbumsImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(true);

    //Carrega fotos do album ao abrir a pagina
    useEffect(() => {
        getAlbumsImages();
    }, []);

    //GET ALBUMS IMAGES
    function getAlbumsImages() {
        fetch(`https://api.imgur.com/3/album/${params.id}/images`, {
            method: 'GET',
            headers: {
                'Authorization': process.env.REACT_APP_AUTHORIZATION_BEARER,
            }
        })
            .then(res => res.json())
            .then(res => {
                setAlbumsImages(res.data);
                setLoadingImages(false);
            })
    }

    //Seleciona o arquivo de imagem
    function handleSelect(e) {
        setImage(e.target.files[0]);
        document.querySelector('#inputTextFile').textContent = e.target.files[0].name;
    }

    //POST IMAGE UPLOAD
    function handleUpload(e) {
        e.preventDefault();
        setLoadingImages(true);
        document.querySelector('#inputTextFile').textContent = 'Nenhum arquivo selecionado.';

        const FD = new FormData();
        FD.append('image', image);

        fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            body: FD,
            headers: {
                'Authorization': process.env.REACT_APP_AUTHORIZATION_BEARER,
            }
        })
            .then(res => res.json())
            .then(res => handleSuccess(res))
    }

    //Recebe o upload e pega o id da imagem
    function handleSuccess(res) {
        const { data: { id } } = res
        addImage(id)
    }

    //POST ADD IMAGES TO ALBUM
    function addImage(id) {
        const FD = new FormData();
        FD.append('ids[]', id);

        fetch(`https://api.imgur.com/3/album/${params.id}/add`, {
            method: 'POST',
            body: FD,
            headers: {
                'Authorization': process.env.REACT_APP_AUTHORIZATION_BEARER,
            }
        }).then(() => getAlbumsImages());
    }


    //DELETE IMAGE
    function deleteImage(albumImageId) {
        setLoadingImages(true);
        fetch(`https://api.imgur.com/3/image/${albumImageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': process.env.REACT_APP_AUTHORIZATION_BEARER,
            }
        }).then(() => getAlbumsImages());
    }



    return (
        <div id="albumContainer">
            <header>
                <section>
                    <h3>Adicionar foto: </h3>
                    <div>
                        <label>Selecionar Foto
                        <input type="file" onChange={handleSelect} />
                        </label>
                        <div id="inputTextFile">
                            Nenhum arquivo selecionado.
                        </div>
                        <button onClick={handleUpload}>Upload</button>
                    </div>
                </section>
                <div className="loadingDiv">
                    {loadingImages ? <div className="loadingAnimation"></div> : null}
                </div>
                <section>
                    <Link to={{ pathname: '/' }}>
                        <button className="buttonVoltar">Voltar</button>
                    </Link>
                </section>
            </header>


            <div id="photoContainer">
                {
                    albumsImages.map(albumImage => {
                        return (
                            <div className="photoCard" key={albumImage.id}>
                                <div className="photoCardImg" onClick={() => window.open(`https://imgur.com/${albumImage.id}`, '_blank')}>
                                    <img
                                        alt="img-albums"
                                        src={albumImage.link}>
                                    </img>
                                </div>
                                <div className="deleteCard">
                                    <button onClick={() => deleteImage(albumImage.id)}>Deletar Imagem</button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>


        </div>
    )
}

export default Album;