import React from "react";
import PropTypes from "prop-types";

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

//import "./Display.css";
/*
const prepareMarkdownState = async (reportPrefix) => {
  // get objects
  Storage.list(reportPrefix) // for listing ALL files without prefix, pass '' instead
    .then(result => processReportStorageList(result))
    .catch(err => console.log(err));
}

async function processReportStorageList(result) {
  //let images = []
  //let folders = new Set()
  result.forEach(res => {
    
    const fileType = res.key.split('.').reverse()[0]
    if (fileType === 'md') {
      // process markdown
      //console.log(res)
      
      fetchMarkdown(res.key)
      const report = {
          key: res.key,
          modified: +Moment().subtract(3, 'days'),
          size: res.size
      }
      
      setTopics(oldArray => [...oldArray, report])
    } if (fileType === 'png') {
      // process image
      const signedUrl = Storage.get(res.key)
      .then(signedUrl => {
        //console.log(res.key.split('/').reverse()[0])
        const markdownPath = res.key.split('/').reverse()[0]
        images[markdownPath] = signedUrl
        //console.log(images)
      })
    }
  })
  return ''
}

console.log(topics)

const fetchMarkdown = async (key) => {
  try {
    const result = await Storage.get(key, { download : true});
    //console.log('markdownData', result);
    result.Body.text().then(string => { 
      setMarkdown(string)
    });
  } catch(error) {
    console.log('error on fetching markdown', error);
  }
}
*/

// try functional approach

export default class Report extends React.Component {
  static propTypes = {
    reportKey: PropTypes.string,
  };

  state = {
    images: {},
    report: this.fetchMarkdown(this)
  };

  fetchMarkdown = async () => {
    try {
      const result = await Storage.get(this.props.reportKey, { download : true});
      //console.log('markdownData', result);
      result.Body.text().then(string => { 
        console.log(string)
        this.setState({
          report: string
        })
        //setMarkdown(string)
      });
    } catch(error) {
      console.log('error on fetching markdown', error);
    }
  }

  render() {
    return (
      <div className="report">
        <div>{this.props.reportKey}</div>
        <div className='markdown-body'>
        <ReactMarkdown
          children={this.state.report}//{markdown}
          remarkPlugins={[remarkGfm]}
          transformImageUri={
            //prepareImageUri
            uri => this.state.images[uri]
          }
          />
        </div>
      </div>
    );
  }
}