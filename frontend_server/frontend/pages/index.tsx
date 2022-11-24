import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

// import Container from "@mui/material/Container";

import Script from 'next/script'
import React, { useState, useEffect } from 'react'

import dynamic from 'next/dynamic'

const label = { inputProps: { "aria-label": "Switch demo" } };

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another

import { Container } from '@mui/system';
import { Paper } from '@mui/material';
import { Grid } from '@mui/material';
import { Button } from '@mui/material';

export default function Home() {
  const [code, setCode] = React.useState(
    `function add(a, b) {\n  return a + b;\n}`
  );

  const title = "Sum two numbers";

  return (
    <>
      <Container maxWidth="lg" sx={{ background: 'white', height: '30em', mt: '3em' }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
              <Paper elevation={3} className='paper' sx={{ background: 'white', height: '26em' }}> 
                <h2> {title} </h2>  
                Write a function that returns the sum of two numbers.<br/>
                <h3>Example:</h3>
                For param1 = 1 and param2 = 2, the output should be solution(param1, param2) = 3.<br/>
              </Paper>
          </Grid>
          <Grid item xs={8}>
              <Paper elevation={3} className='paper' sx={{ background: 'white', height: '26em' }}> 
                <Editor
                  value={code}
                  onValueChange={code => setCode(code)}
                  highlight={code => highlight(code, languages.js)}
                  padding={10}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,
                    height: '29em'
                  }}
                />
                <Button variant="outlined" color='success' onClick={() => { alert('clicked'); }}>Run</Button>
              </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
