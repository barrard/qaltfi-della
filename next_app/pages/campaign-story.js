import React from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import {toastr} from 'react-redux-toastr'
import $ from "jquery";
import{SET_USER_CROWDSALE} from '../redux/store.js'
import {
  Campaign_Builder_Breadcrumbs,
  My_Story_Preview
} from "../components/small_ui_items.js";

import Main_Layout from "../layouts/Main_Layout.js";
class Contracts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crowdsale_youtube_link: props.user_crowdsale.parsed_youtube_link,
      // risk_factors: risk_factors,
      // written_story: written_story,
      save_state: true
    };
    this.parsed_youtube_link = this.parsed_youtube_link.bind(this)
    this.toggle_save_state = this.toggle_save_state.bind(this)
    this.handle_auto_save = this.handle_auto_save.bind(this)
    this.auto_save = this.auto_save.bind(this)
    this.save_my_story_update = this.save_my_story_update.bind(this)
  }

  componentDidMount() {
    //AUTO_SAVE
    var all_inputs = $("input");
    all_inputs = [...all_inputs, $("textarea")];
    all_inputs = [...all_inputs, $("select")];
    $.each(all_inputs, (index, input) => {
      //remove this from the gooogle input box
      if (input.id != "address_search") this.add_auto_save(index, input);
    });
  }

  handle_auto_save() {
    console.log("blur");
    if (!this.state.save_state) {
      console.log("SAVE ME");
      console.log(this.state.save_state);
      this.auto_save();
    }

    if (this.state.save_state) {
      console.log(this.state.save_state);
      console.log("DONT SAVE ME!!!");
    }
  }

  toggle_save_state() {
    console.log("input");
    this.state.save_state = false;
    console.log(this.state.save_state);
  }

  add_auto_save(index, input) {
    $(input).on("input", this.toggle_save_state);
    $(input).on("blur", this.handle_auto_save);
  }

  auto_save() {
    this.save_my_story_update();
  }

  async save_my_story_update() {
    try {
      if (this.state.save_state) return;
      console.log("save_my_story_update");
      
      const {
        risk_factors,
        written_story} = this.props.user_crowdsale
  
      var data = {
        parsed_youtube_link:this.parsed_youtube_link(),
        risk_factors,
        written_story
      };
  
      console.log("data");
      console.log(data);
  
      let updated_story = await $.post(
        "/crowdsale/save_my_story_update",
        { ...data, _csrf: this.props.csrf });
        if(updated_story.err)throw updated_story.err
  
          console.log(updated_story.resp);
          this.props.dispatch(
            SET_USER_CROWDSALE(updated_story.resp)
          )
          toastr.success("Story saved!");
          this.state.save_state = true;
    } catch (err) {
      console.log('err')
      console.log(err)
      toastr.error(err);
    }

 
    
  
  }

  parsed_youtube_link() {
    const link = this.state.crowdsale_youtube_link;
    if (link.indexOf("embed") != -1) return link;
    if (link.indexOf("watch") != -1) {
      // https://www.youtube.com/embed/QfUBty3_zpE?rel=0
      // https://www.youtube.com/watch?v=3nl3LFgKZ2o
      var parsed_link = link.split("watch");
      if (parsed_link.length == 2) {
        if (parsed_link[1].indexOf("?v=") != -1) {
          const video_id = parsed_link[1].split("?v=")[1];
          return parsed_link[0] + "embed/" + video_id;
        }
      }
    } else {
      return "";
    }
  }

//UPDATE_CROWDSALE
  handle_store_input(value, type, key) {
    console.log({ value, type, key });
    this.props.dispatch({ type, value, key });

  }



  render() {
    const { pathname } = this.props.router;

    return (
      <Main_Layout>
        <br />
        <br />
        <br />
        <div className="container" id="my_story">
          <div className="row">
            <div className="col-sm-12">
              <Campaign_Builder_Breadcrumbs pathname={pathname} />
            </div>

            <div className="col-sm-8">
              <h1>Here you can share your story with investors.</h1>

            
                <div className="form-group light-blue">
                  <div className="form-group row">
                    <label
                      htmlFor="example-text-input"
                      className="col-3 col-form-label"
                    >
                      Personal video
                    </label>
                    <div className="col-9">
                      <div
                        style={{
                          border: '1px dashed #000',
                          background: '#fff',
                          width: '100%',
                          display: 'block',
                          padding: '20px'
                        }}
                        className="text-center"
                      >
                        <p className="text-center">
                          <strong>
                            Add a YouTube video showing the property; include
                            how and why a conventional loan isn't right for your
                            situation
                          </strong>
                        </p>
                        <input
                          type="text"
                          onChange={
                            ()=>this.setState({crowdsale_youtube_link:event.target.value})
                            // ()=>this.handle_store_input(event.target.value ,"UPDATE_CROWDSALE", 'crowdsale_youtube_link')
                          }
                          value={
                            this.state.crowdsale_youtube_link
                          }
                          placeholder="Property YouTube URL"
                        />
                      </div>
                      <br />
                    </div>
                  </div>
                </div>

                <div className="form-group light-blue">
                  <div className="form-group row">
                    <label
                      htmlFor="example-text-input"
                      className="col-3 col-form-label"
                    >
                      Written description of your story
                    </label>
                    <div className="col-9">
                      <p className="mt-1">
                        Writen story to compliment your video above.
                      </p>
                      <textarea
                        rows="11"
                        className="form-control"
                        onChange={
                          ()=>this.handle_store_input(event.target.value ,"UPDATE_CROWDSALE", 'written_story')
                        }
                        value={this.props.user_crowdsale.written_story}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group light-blue">
                  <div className="form-group row">
                    <label
                      htmlFor="example-text-input"
                      className="col-3 col-form-label"
                    >
                      Risks and challenges
                    </label>
                    <div className="col-9">
                      <p className="mt-1">List risk factors</p>

                      <textarea
                        rows="5"
                        className="form-control"
                        onChange={
                          ()=>this.handle_store_input(event.target.value ,"UPDATE_CROWDSALE", 'risk_factors')
                        }
                        value={this.props.user_crowdsale.risk_factors}
                      />
                    </div>
                  </div>
                </div>
            </div>

            <div className="col-sm-4">
              <div className="row">
                <div className="col-sm-10 offset-sm-2">
                  <strong>Preview My Story</strong>
                  <hr />
                  <My_Story_Preview 
                    parsed_youtube_link={this.props.user_crowdsale.parsed_youtube_link}
                    crowdsale={this.props.user_crowdsale} />
                </div>
              </div>
            </div>
            <div className="col-sm-12">
              <Campaign_Builder_Breadcrumbs pathname={pathname} />
            </div>
          </div>
          <br />
          <br />
          <br />
        </div>
      </Main_Layout>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals, crowdsales } = state;
  return { ...user, ...csrf, ...locals, ...crowdsales };
}

export default connect(mapStateToProps)(withRouter(Contracts));
