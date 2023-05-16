import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./ActivityForm.css";

const UpdateActivity = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedActivity, setLoadedActivity] = useState();
  const activityId = useParams().activityId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      time: {
        value: "",
        isValid: false,
      },
      date: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/api/activity/${activityId}`
        );
        setLoadedActivity(responseData.activity);
        setFormData(
          {
            title: {
              value: responseData.activity.title,
              isValid: true,
            },
            description: {
              value: responseData.activity.description,
              isValid: true,
            },
            time: {
              value: responseData.activity.time,
              isValid: true,
            },
            date: {
              value: responseData.activity.date,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchActivity();
  }, [sendRequest, activityId, setFormData]);

  const activityUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:8000/api/activity/${activityId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          time: formState.inputs.time.value,
          date: formState.inputs.date.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/" + auth.userId + "/activity");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedActivity && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedActivity && (
        <form className="activity-form" onSubmit={activityUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedActivity.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedActivity.description}
            initialValid={true}
          />
          <Input
            id="time"
            element="input"
            type="text"
            label="Time"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a time."
            onInput={inputHandler}
            initialValue={loadedActivity.time}
            initialValid={true}
          />
          <Input
            id="date"
            element="input"
            type="text"
            label="Date"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a date."
            onInput={inputHandler}
            initialValue={loadedActivity.date}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE ACTIVITY
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateActivity;