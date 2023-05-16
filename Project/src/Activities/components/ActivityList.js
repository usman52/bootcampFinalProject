import React from "react";

import Card from "../../shared/components/UIElements/Card";
import ActivityItem from "./ActivityItem";
import Button from "../../shared/components/FormElements/Button";
import "./ActivityList.css";

const ActivityList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="activity-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/activities/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="activity-list">
      {props.items.map((activity) => (
        <ActivityItem
          key={activity.id}
          id={activity.id}
          image={activity.image}
          title={activity.title}
          description={activity.description}
          time={activity.time}
          date={activity.date}
          creatorId={activity.creator}
          onDelete={props.onDeleteActivity}
        />
      ))}
    </ul>
  );
};

export default ActivityList;