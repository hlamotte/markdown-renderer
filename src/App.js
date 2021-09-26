import logo from './logo.svg';
import './App.css';

import React from 'react'
import { useEffect, useState } from 'react';
import ReactDom from 'react-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import Amplify , { Storage } from 'aws-amplify';
import awsconfig from './aws-exports';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
//import 'github-markdown-css'
import './markdown.css'
import './virtualizedList.js'
import FileBrowser, { FileRenderers, FolderRenderers, Groupers, Icons } from 'react-keyed-file-browser'
import Moment from 'moment'
import Report from './components/Report.js'

import { List, ListItem } from '@material-ui/core';
import VirtualizedList from './virtualizedList.js';
import NestedBrowser from './nestedBrowser.js';
import '../node_modules/react-keyed-file-browser/dist/react-keyed-file-browser.css'
// this imports the FontAwesome Icon Styles
import 'font-awesome/css/font-awesome.min.css'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useParams,
  useRouteMatch
} from "react-router-dom";

Amplify.configure(awsconfig);

const reportPrefix = "demo/blog-posts/decision-tree-cpp"

function App() {

  const [topics, setTopics] = useState([]);
  const [reportKey, setReportKey] = useState('');
  const [markdown, setMarkdown] = useState('# abc');
  const [images, setImages] = useState({});

  useEffect(() => {
    chooseAccount();
  }, []);

  const account = 'demo'

function chooseAccount() {
  prepareMarkdownState(account)
}
/*
function parseTopics(result) {
  const parsedTopics = Array.from(new Set(result.map(elem => elem.key.split('/')[1])))
  console.log(parsedTopics)
  return parsedTopics
}

  const fetchTopics = async () => {
    // get objects
    Storage.list(account) // for listing ALL files without prefix, pass '' instead
      .then(result => setTopics(result))//setTopics(parseTopics(result)))
      .catch(err => console.log(err));
  }
*/
  //https://material-ui.com/components/lists/#virtualized-list

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
        // handle the String data return String 
        setMarkdown(string)
      });
      //markdownData.then(result => setMarkdown(result.Body.text()))
      //const markdownText = markdownData.Body.text();
      //console.log('markdownText', markdownText);
      //setMarkdown('# Markdown')
    } catch(error) {
      console.log('error on fetching markdown', error);
    }
  }

  async function prepareImageUri(uri) {
    const key = `${reportPrefix}/${uri}`
    console.log(key)
    const signedUrl = await Storage.get(key)
    //if (uri.startsWith("http")) {
    //  return 
    //}
    console.log(signedUrl)
    return signedUrl//signedUrl
  }

  return (
    <div className="App">
      <Report reportKey="demo/blog-posts/decision-tree-cpp/decision-tree-cpp.md"/>
      <div className="FileBrowser">
      <FileBrowser
          files={
            topics
          }
          //renderStyle="list"
          //group={Groupers.GroupByModifiedRelative}
          headerRenderer={null}
          icons={Icons.FontAwesome(4)}
          showFoldersOnFilter={true}
          //fileRenderer={FileRenderers.ListThumbnailFile}
          //folderRenderer={FolderRenderers.ListThumbnailFolder}
        />
      </div>
      <div className='markdown-body'>
        
        <ReactMarkdown
          children={markdown}
          remarkPlugins={[remarkGfm]}
          transformImageUri={//prepareImageUri
            uri => images[uri]//.then(result => result)//"https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg"
            //uri.startsWith("http") ? uri : `${reportPrefix}${uri}`
          }
          />
        </div>
      <AmplifySignOut />
    </div>
    
  );
  }
/*
  <VirtualizedList items={topics}/>
      <List>
        {topics.map((topic) => (
          <ListItem
          key={topic}
          />
        ))}
      </List>
*/
/*
const ReportName = 'decision-tree-cpp'

const MarkdownFileName = 'decision-tree-cpp.md'

const BucketUrl = 'https://hlamotte-markdown-reports.s3.ap-southeast-1.amazonaws.com/'

const markdownFilePath = ReportName + '/' + ReportName + '.md'
*/
/*()
function GetMarkdown(ReportName, MarkdownFileName) {
  const report = fetch(BucketUrl + ReportName + '/' + MarkdownFileName, {mode: 'no-cors'})
    .then(response => response.json())
    .then(data => console.log(data));
  return report
}
*/
//const markdown
/*
const keys = {};
const key = Storage.list('') // for listing ALL files without prefix, pass '' instead
    .then(result => {
      console.log(result)
      keys['key'] = "decision-tree-cpp/decision-tree-cpp.md"
    })
    .catch(err => console.log(err));

const markdown2 = Storage.get("decision-tree-cpp/decision-tree-cpp.md", {download : true}) // for listing ALL files without prefix, pass '' instead
    .then(result => {
      console.log(result.Body.text())
      //return "decision-tree-cpp/decision-tree-cpp.md"
    })
    .catch(err => console.log(err));
*/
//const result = Storage.get(markdownFilePath, { download: true, contentType: "text/html" });
//console.log(result)
// data.Body is a Blob
//result.Body.text().then(string => { 
  // handle the String data return String 
//});

/*
function getMarkdown(markdownFilePath) {
  const result = Storage.get(markdownFilePath, { download: true });
  console.log('markdownFile', result.resolve());
  /*
  try {
      
      
      //setSongPlaying(idx);
      //setAudioURL(fileAccessURL);
      
      return //result.Body.text()
  } catch (error) {
      console.error('error accessing the file from s3', error);
      //setAudioURL('');
      //setSongPlaying('');
  }
  */
//};
//console.log(markdownFilePath)
//const markdown = getMarkdown(markdownFilePath)

/*
const markdownURL = getMarkdown(markdownFilePath)
fetch(markdownURL)
  .then(function(response) {
    response.text().then(function(text) {
      //storedText = text;
      console.log(markdownURL)
      console.log(text)
      //done();
    });
  });
*/


//console.log(GetMarkdown(ReportName, MarkdownFileName))
/*
const markdown = `# Some exciting markdown \n\n It does render quite nicely.

Lambdas are an ideal tool available on AWS for parsing files landing in S3 as part of an ETL pipeline. Setting up a parsing process with both catch-up (historical files previously landed in S3) and new file parsing functionality requires a bit of extra work. We have created a framework to quickly create a parsing solution with both of these two core functionalities and the code is available [here](https://github.com/hlamotte/aws-solutions/tree/main/batch-trigger-lambda-template).

# Solution details
The diagram below shows the architecture of the solution.

![lambda parsing solution](https://dzxbosgk90qga.cloudfront.net/fit-in/504x658/n/20190131015240478_fullstack-react-cover-medium%402x.png)

Boilerplate code ensures the Lambda is compatible as both a batch and event triggered Lambda and the function \`parse\` in parse.py is where you define the parsing process. A Cloudformation template is used to create the required AWS services, and parameters such as source and target S3 bucket names are defined in this file.

A test environment is available to enable you to test your Lambda locally using the python unittest framework. This enables you to debug your Lambda code locally and deal with permissions issues later on upload.

A manifest, a list of all file paths on S3 requiring processing, is used for the catch-up functionality and a solution for creating a manifest csv file is documented in a previous blog [post](https://datamunch.tech/posts/s3-generate-manifest/).

Full usage instructions can be found on the project [GitHub](https://github.com/hlamotte/aws-solutions/tree/main/batch-trigger-lambda-template). This should provide a number of tools to speed up creating new parsing processes using Lambda.`
*/
/*
ReactDom.render(
  
  document.body
)
*/
/*
function RenderMarkdown() {
  var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();
  var result = md.render('# markdown-it rulezz!');
  return (result);
}
*/
/*
const MyImage = props => {
  const [fullSize, setFullSize] = useState();
  const handleClick = () => {
    setFullSize(!fullSize);
  };
  return (
    <img
      className={fullSize ? "large" : "small"}
      alt={props.alt}
      src={props.src}
      onClick={handleClick}
    />
  );
};


function App() {
  //console.log(RenderMarkdown())
  const renderers = {
    image: MyImage
  };
  return (
    <div className="App">
      <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} renderers={renderers}/>
      <AmplifySignOut />
    </div>
    
  );
}
*/
export default withAuthenticator(App);


/*<header className="App-header">
<img src={logo} className="App-logo" alt="logo" />
<p>
  Edit <code>src/App.js</code> and save to reload.
</p>
<a
  className="App-link"
  href="https://reactjs.org"
  target="_blank"
  rel="noopener noreferrer"
>
  Learn React
</a>
</header>
*/