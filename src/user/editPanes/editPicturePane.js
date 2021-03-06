import axios from "axios";
import React from "react";
import { API_DOMAIN } from "../../config";
import './editProjectsPane.css';

class EditPicturePane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            changePicture: false,
            saveBioText: "Save",
            firstname: this.props.user.firstname,
            lastname: this.props.user.lastname,
            bioText: this.props.user.bio.text,
            socials: this.props.user.bio.socials,
            category: this.props.user.bio.category,
            picture: {},
            changeDPText: "Upload",
            loading: false
        }

        this.cancelHandler = this.cancelHandler.bind(this);
        this.showProfilePicEdit = this.showProfilePicEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);

    }

    showProfilePicEdit(e) {
        e.preventDefault();
        this.setState({
            changePicture: !this.state.changePicture
        })
    }
    cancelHandler(e) {
        this.props.onCancel(e.target.value);
    };

    handleFileChange = (event) => {
        this.setState({picture: {"index": event.target.id, "name": event.target.name, "filename": event.target.value}});
    }

    firstnameChange = event => {
        this.setState({
            firstname: event.target.value
        })
    }

    lastnameChange = event => {
        this.setState({
            lastname: event.target.value
        })
    }

    bioChange = event => {
        this.setState({
            bioText: event.target.value
        })
    }

    // Break up social media links by new line character
    socialsChange = event => {

        var socialString = event.target.value;
        var socialsList = socialString.split("\n");
        console.log(socialsList);
        this.setState({
            socials: socialsList
        })

    }

    // Render social media links on new lines in edit form
    renderSocials(socials) {
        var socialString = socials.join();
        var outputString = "";
        for (let i=0; i<socialString.length; i++) {
            if (socialString[i] === ",") {
                outputString += "\n"
            }
            else {
                outputString += socialString[i]
            }
        }
        return outputString;
    }

    categoryChange = event => {
        this.setState({
            category: event.target.value
        })
    }
    renderCategoryInputs() {
        if (this.state.category === 'JOB_SEARCHER') {
            return (
                <div onChange={this.categoryChange}>
                    <input type="radio" name="category" value="JOB_SEARCHER" defaultChecked/>
                    <label htmlFor="JOB_SEARCHER">Job Searcher</label><br />
                    <input type="radio" name="category" value="RECRUITER" />
                    <label htmlFor="RECRUITER">Employer/Recruiter</label><br />
                    <br></br>
                </div> 
            )
        }
        else {
            return (
                <div onChange={this.categoryChange}>
                    <input type="radio" name="category" value="JOB_SEARCHER" />
                    <label htmlFor="JOB_SEARCHER">Job Searcher</label><br />
                    <input type="radio" name="category" value="RECRUITER" defaultChecked/>
                    <label htmlFor="RECRUITER">Employer/Recruiter</label><br />
                    <br></br>
                </div>
            )
            
        }
        
    }

    handleSubmit = event => {
        event.preventDefault();
        this.setState({
            saveBioText: "Saving...",
            loading: true
        })

        var nameBody = {
            "firstname": this.state.firstname,
            "lastname": this.state.lastname
        }
        var bioBody = {
            "text": this.state.bioText,
            "socials": this.state.socials,
            "category": this.state.category
        }
        console.log(bioBody);
        var config = {
            headers: {
                "x-auth-token": this.props.auth.token
            }
        }

        axios.post(API_DOMAIN+"/profile/bio/update", bioBody, config)
        .then(res => {
            console.log(res);
            if (this.state.firstname !== this.props.user.firstname || this.state.lastname !== this.props.user.lastname) {
                axios.post(API_DOMAIN+"/profile/name/update", nameBody, config)
                .then(res => {
                    console.log(res);
                    window.location.reload();
                })
                .catch(err => {
                    console.log(err);
                })
            }
            else {
                window.location.reload();
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    handleDPSubmit = event => {
        event.preventDefault();

        this.setState({
            changeDPText: "Uploading...",
            loading: true
        })
        

        var input = document.getElementById(this.state.picture.index);

        if (input === null) {
            this.setState({
                changeDPText: "Upload",
                loading: false
            })
            return;
        }
        var fileBody = new FormData();
        fileBody.append(this.state.picture.name, input.files[0]);

        const fileConfig = {
            headers: {
                "accept": "application/json",
                "Content-type": "multipart/form-data",
                "x-auth-token": this.props.auth.token
            }
        }

        axios.post(API_DOMAIN+"/profile/uploadDP", fileBody, fileConfig)
        .then(res => {
            console.log(res);
            window.location.reload();
        })
        .catch(err => {
            console.log(err);
        })
    }


    render() {
        if (!this.props.showPane){
            return null;
        }
        console.log(this.props.user);
        return (
            <div className="editProjectsOverlay">
                { 
                        this.state.loading && (
                            <div className='loadingScreen'>
                                <i className="material-icons w3-spin">refresh</i>
                            </div>
                        )
                }
                <div className="editProjectsOverlayContainer">
                <div className="overlayButtonsContainer">
                    <button className="cancelButton" onClick={this.cancelHandler}><i className="material-icons">close</i></button> 
                </div>
                    {
                        this.props.user && (
                            <div className="editProjectsContainer">
                                <div className="editBioForm">
                                    <div>
                                        {/* <button onClick={this.showProfilePicEdit}>Change Profile Picture</button> */}
                                        {/* {
                                            this.state.changePicture && ( */}
                                        <div>
                                            <h3>Profile Picture</h3>
                                            {
                                                this.props.user.picture === "" ? (
                                                    <img src={"../../noprofile.jpg"} alt="User Profile Picture" />
                                                ) :
                                                (
                                                    <img src={this.props.user.picture} alt="User Profile Picture" />
                                                )
                                            }
                                            
                                            <form onSubmit={this.handleDPSubmit}>
                                                <label>Upload Profile Picture: </label>
                                                <br></br><br></br>
                                                <input onChange={this.handleFileChange} type="file" id="dpUpload" name="userFile"/>
                                                <br></br><br></br>
                                                <input type="submit" value={this.state.changeDPText} />
                                            </form>
                                        </div>
                                        {/* )
                                            } */}
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    
                    
                    

                </div>
            </div>
        )
    }
}

export default EditPicturePane;