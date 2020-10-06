import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
require('dotenv').config()

function Home() {
    const [albums, setAlbums] = useState([]);
    const [albumName, setAlbumName] = useState([]);
    const [loadingAlbum, setLoadingAlbum] = useState(true);
    const [safetyDelete, setSafetyDelete] = useState(false);
    const [deleteConfirmationID, setDeleteConfirmationID] = useState([]);


    useEffect(() => {
        getAlbums();
    }, []);

    //GET ALBUMS
    function getAlbums() {
        fetch('https://api.imgur.com/3/account/leo0808api/albums/', {
            method: 'GET',
            headers: {
                'Authorization': process.env.REACT_APP_AUTHORIZATION_BEARER,
            }
        })
            .then(res => res.json())
            .then(res => {
                setAlbums(res.data);
                setLoadingAlbum(false);
            })
    }

    //Passa o nome do album digitado no input para o state e vai para o createAlbum
    function handleChange(event) {
        setAlbumName(event.target.value)
    }

    function checkIfAlbumNameIsNotEmpty() {
        if (document.querySelector('#inputElement').value === '') {
            alert('Por favor digite um nome para seu álbum');
            return false;
        }
        else {
            createAlbum();
        }
    }

    //POST ALBUM CREATION
    function createAlbum() {
        setLoadingAlbum(true);

        const FD = new FormData();

        FD.append('title', albumName);
        fetch('https://api.imgur.com/3/album', {
            method: 'POST',
            body: FD,
            headers: {
                'Authorization': process.env.REACT_APP_AUTHORIZATION_BEARER,
            },
        }).then(() => getAlbums());
        document.querySelector('#inputElement').value = '';
    }


    //DELETE ALBUM
    function deleteAlbum(albumId) {
        setLoadingAlbum(true);

        fetch(`https://api.imgur.com/3/album/${albumId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': process.env.REACT_APP_AUTHORIZATION_BEARER,
            }
        }).then(() => {
            getAlbums();
            setSafetyDelete(false);
        })
    }



    return (
        <div id="container">
            <header>
                <h1>Linx Imgur App</h1>
                <p>Crie seus álbuns e faça upload das suas fotos favoritas!</p>

                <section id="buttons">
                    <h2>Criar Álbum: </h2>
                    <input id="inputElement" type="text" onChange={handleChange} />
                    <button onClick={checkIfAlbumNameIsNotEmpty}>+ Novo Álbum</button>
                    <div className="loadingDiv">
                        {loadingAlbum ? <div className="loadingAnimation"></div> : null}
                    </div>

                    {
                        safetyDelete ?
                            <div id="safetyDelete">
                                <h2>Deseja mesmo deletar o álbum?</h2>
                                <p>Isso irá fazer com que todas as imagens dentro dele sejam deletadas</p>
                                <button className="deleteButton" onClick={() => deleteAlbum(deleteConfirmationID)}>Deletar Álbum</button>
                                <button className="buttonVoltar" onClick={() => setSafetyDelete(false)}>Cancelar</button>
                            </div>
                            : null
                    }
                </section>
            </header>


            <main>
                <h2>Meus Álbuns: </h2>
                {
                    albums.map(album => {
                        return (
                            <div key={album.id} className="album">
                                <Link to={{ pathname: '/album/' + album.id }}>
                                    <h2>{album.title}</h2>
                                    {album.cover ?

                                        <img
                                            className="imgCover"
                                            alt="img cover"
                                            src={
                                                `https://i.imgur.com/${album.cover}.jpg` || `https://i.imgur.com/${album.cover}.png`
                                            }>
                                        </img> : null}
                                </Link>
                                <button className="deleteButton" onClick={() => { setDeleteConfirmationID(album.id); setSafetyDelete(true); }}>Deletar Álbum</button>
                            </div>
                        )
                    })
                }
            </main>

        </div>
    )
}

export default Home;
