---
title: "Interactive Components Showcase"
department: "Autonomy"
author: "Test Builder"
builderImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=test"
publishDate: 2026-02-06
coverImage: ""
---

# Interactive Components Test

This article demonstrates all the interactive components available in our blog platform.

## Chart Components

### Line Chart Example

<TelemetryChart client:load type="line" title="Speed Over Time" xAxis="name" yAxis="val" data={[{"name": "0s", "val": 0}, {"name": "1s", "val": 10}, {"name": "2s", "val": 25}, {"name": "3s", "val": 22}, {"name": "4s", "val": 30}, {"name": "5s", "val": 35}]} />

### Area Chart Example

<TelemetryChart client:load type="area" title="Battery Performance" xAxis="name" yAxis="val" data={[{"name": "Mon", "val": 95}, {"name": "Tue", "val": 88}, {"name": "Wed", "val": 92}, {"name": "Thu", "val": 85}, {"name": "Fri", "val": 90}]} />

### Bar Chart Example

<TelemetryChart client:load type="bar" title="Task Completion Rate" xAxis="name" yAxis="val" data={[{"name": "Week 1", "val": 45}, {"name": "Week 2", "val": 52}, {"name": "Week 3", "val": 48}, {"name": "Week 4", "val": 60}]} />

### Pie Chart Example

<TelemetryChart client:load type="pie" title="System Resource Usage" xAxis="name" yAxis="val" data={[{"name": "CPU", "val": 30}, {"name": "Memory", "val": 45}, {"name": "Storage", "val": 15}, {"name": "Network", "val": 10}]} />

## Metric Cards

<MetricCard client:load value="99.9%" label="Uptime" description="Last 30 days" trend="up" trendValue="+0.1%" />

<MetricCard client:load value="2.3ms" label="Response Time" description="Average latency" trend="down" trendValue="-15%" />

<MetricCard client:load value="1,247" label="Active Robots" trend="neutral" />

## Video Player

<VideoPlayer client:load src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217" caption="Sample robot demonstration video" autoplay={false} loop={true} muted={true} />

## Before/After Slider

<BeforeAfterSlider client:load beforeImage="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800" afterImage="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800" beforeLabel="Before Optimization" afterLabel="After Optimization" />

## Image Gallery

<ImageGallery client:load images={[{"src": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400", "caption": "Robot Assembly", "alt": "Robot 1"}, {"src": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400", "caption": "Testing Phase", "alt": "Robot 2"}, {"src": "https://images.unsplash.com/photo-1563207153-f403bf289096?w=400", "caption": "Final Product", "alt": "Robot 3"}]} columns={3} />

## Callout Boxes

<CalloutBox client:load type="info" title="Important Note">
This is an informational callout box to highlight key information.
</CalloutBox>

<CalloutBox client:load type="warning" title="Caution">
Warning callouts help draw attention to potential issues.
</CalloutBox>

<CalloutBox client:load type="success" title="Achievement Unlocked">
Success callouts celebrate wins and milestones!
</CalloutBox>

<CalloutBox client:load type="insight" title="Key Insight">
Insight boxes share important learnings and observations.
</CalloutBox>

## Tabs Component

<TabsComponent client:load tabs={[{"id": "overview", "label": "Overview", "content": "This tab contains overview information about the project."}, {"id": "specs", "label": "Specifications", "content": "**Technical Specs:**\n- Weight: 45kg\n- Height: 1.2m\n- Battery: 48V Li-ion"}, {"id": "results", "label": "Results", "content": "Our testing showed a 35% improvement in efficiency."}]} />

---

All components are working perfectly! This demonstrates the full interactive capability of our blog platform.
