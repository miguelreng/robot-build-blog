import fs from 'fs';
import path from 'path';

const INPUT_FILE = 'robot-blog/external-memos/Data/Builders/2026Q1_W4_LorenaCardona-DataEngineer-Memo.md';
const OUTPUT_DIR = 'robot-blog/src/content/posts';

async function transformMemo() {
  const content = fs.readFileSync(INPUT_FILE, 'utf-8');
  
  // Script rápido de transformación simulando lo que haría la AI
  // En una versión final, aquí llamaríamos a Gemini para reescribir.
  const transformedContent = `---
title: "Visual Navigation 0.5: From Simulation to Reality"
pubDate: 2026-01-20
author: "Lorena Cardona"
description: "Improving computer vision pipelines for sidewalk image analysis in Arlington."
---
import BeforeAfterSlider from '../../components/BeforeAfterSlider';

# Computer Vision Improvements for Sidewalk Analysis

We are focus on increasing the reliability of both image quality validation and defect detection in our Arlington deployments.

## The Quality Pipeline

The system now applies smarter quality checks using OpenCV, combining blur detection, texture analysis, and edge density.

<BeforeAfterSlider 
  client:load
  beforeLabel="Raw Feed"
  afterLabel="Processed"
  beforeImage="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000" 
  afterImage="https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=1000"
/>

## Defect Detection

For defect detection, we enhanced the pipeline by integrating pretrained deep learning models, including UNet-based crack segmentation and YOLO-based segmentation models.

> "The system automatically rejects images where a sidewalk surface is not clearly visible, reducing noise from irrelevant scenes."

These models are combined with contextual rules to better distinguish real sidewalk defects from patterns caused by pavers, crosswalk paint, or shadows.
`;

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'visual-navigation-v05.mdx'), transformedContent);
  console.log('Memo transformed successfully to MDX!');
}

transformMemo();
