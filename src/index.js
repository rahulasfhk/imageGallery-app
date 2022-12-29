import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { storage } from "./firebase/config";
import PermMediaOutlinedIcon from '@mui/icons-material/PermMediaOutlined';
import "./App.css";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import DownloadIcon from '@mui/icons-material/Download';
import { Pagination } from "@mui/material";
import usePagination from "./hooks/usePagination";

const ReactFirebaseFileUpload = () => {
  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);
  const [progress, setProgress] = useState(0);
  const [page,setPage] =useState(1)
 


  const handleChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prevState) => [...prevState, newImage]);
    }
  };

  console.log(images,"imagesisconsoled")


  const handleUpload = () => {
    // if(images?.length>=1){
    //   setImages([])
    // }
    const promises = [];
    
    images.map((image) => {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      promises.push(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        async () => {
          await storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((urls) => {
              setUrls((prevState) => [...prevState, urls]);
            });
        }
      );
    });


  };

  console.log(urls,"urlsjf")
  const handleInputChange = (e) =>{
    setPage(parseInt(e.currentTarget.textContent));
    _Data.jump(page)

    let value = images?.slice(0,5);
  } 

  useEffect(() => {
    handleUpload();
  }, [images])

  const _Data= usePagination(urls,6)

  return (
    <div>
       <div className='background'>
    <div className="title">
     <div className='header'>
     <PermMediaOutlinedIcon  className="gallery"style={{ color: "white" }}/>
     <h1>My Gallery</h1>
     </div>
      <h2>Image Uploader App</h2>
      <p>Inspirational designs, illustrations, and graphic elements from the world’s best designers.</p>
    </div>
    </div>
      <progress className="progress"value={progress} max="100" />
      <br />
      <br />
      <form>
        <label>
          <input type="file" multiple onChange={handleChange} />     
          <AddCircleOutlineIcon
          ></AddCircleOutlineIcon>
        </label>
        {/* <DownloadIcon className="downloadicon" onClick={handleUpload}   style={{ color: "#1a73e8" }}/> */}
      </form>
     
      <br />
      {/* {urls.map((url, i) => (
        <div key={i}>
          <a href={url} target="_blank">
            {url}
          </a>
        </div>
      ))}
      <br /> */}
      { _Data && _Data.currentData()?.map((url, i) => (
        <>
        {console.log(url,"urlsfa")}
        <img
          key={i}
          style={{ width: "300px" ,height:"300px",padding:"30px",marginLeft:"80px"}}
          src={url || "http://via.placeholder.com/300"}
          alt="firebase-image"
        />
        </>
      ))}

        {/* {
         _Data && _Data.currentData()?.map((doc)=>{
          console.log(doc,"docisconsoledfkjsf")
            return (
            <div className="img-wrap" key={doc}> 
            {doc &&<img src={doc} alt="uploaded pic"/>}
            </div>
         )
        })
        } */}


    <Pagination count={6} color="primary" onChange={(e)=>handleInputChange(e)} page={page} style={{display:"flex",alignItems:"center", justifyContent:"center"}}/>
    </div>
  );
};

render(<ReactFirebaseFileUpload />, document.querySelector("#root"));