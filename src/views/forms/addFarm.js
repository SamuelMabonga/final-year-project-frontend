import React from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Form, Field, FieldArray } from 'formik'
import { TextField } from 'material-ui-formik-components/TextField'
import { Select } from 'material-ui-formik-components/Select'
import { ChipInput } from 'material-ui-formik-components/ChipInput'

import {
  Box,
  Button,
  Container,
  Typography,
  makeStyles
} from '@material-ui/core';
import MuiPhoneNumber from 'material-ui-phone-number'
import Page from 'src/components/Page';

import { postFarm, useAuthState, useAuthDispatch } from '../../Context';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const emptyAnimalsObject = {
  name: '',
  number: '',
  organic: false,
  comments: '',
}

const emptyPermanentCropsObject = {
  name: '',
  acreage: '',
  quantity: '',
  datePlanted: '',
  estYield: '',
  lastChemicalUse: '',
  organic: false,
  comments: ''
}

const emptyAnnualCropsObject = {
  name: '',
  acreage: '',
  quantity: '',
  lastChemicalUse: '',
  organic: false,
  comments: ''
}

const emptyHistoryObject = {
  crop: '',
  organic: false
}

const RegisterFarmView = () => { 
  const classes = useStyles();
  const navigate = useNavigate();

  const dispatch = useAuthDispatch();
  const { loading, errorMessage, token } = useAuthState();
  
  return (
    <Page
      className={classes.root}
      title="Register Farm"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              name: '',
              owner: '',
              village: '',
              animals: [],
              permanentCrops: [],
              annualCrops: [],
              history: [],
              generalComments: 'Male',
            }}
            validationSchema={
              Yup.object().shape({
                name: Yup.string().max(255).required('Name is required'),
                owner: Yup.string().max(255).required('Owner is required'),
              })
            }
            onSubmit={async values => {
              console.log(values)
              try {
                let response = await postFarm(dispatch, values, token);
                if (!response) return;
                console.log('Responded')
                return navigate('/app/dashboard', { replace: true });
              } catch (error) {
                console.log(error);
                console.log(errorMessage)
              }
            }}
          >
            {formik => ( 
              <Form>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Create new Farm
                  </Typography>
                </Box>
                <Field 
                  name="name" 
                  label="Name" 
                  component={TextField} 
                />
                <Field 
                  name="owner" 
                  label="Owner" 
                  component={TextField} 
                />
                <Field 
                  name="village" 
                  label="Village" 
                  component={TextField} 
                />
                <FieldArray
                  name="animals"
                  render={(arrayHelpers) => (
                    <div>
                      {formik.values.animals && formik.values.animals.length > 0 ? (
                        formik.values.animals.map((animal, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={index}>
                            <Field
                              name={`animals.${index}.name`}
                              component={TextField}
                              label="Name (at least 3 chars)"
                              required
                            />
                            <Field
                              name={`animals.${index}.number`}
                              component={ChipInput}
                              label="Number (type the number of animals and press space)"
                              required
                            />
                            <Field
                              name={`animals.${index}.organic`}
                              component={Select}
                              options={[
                                { value: true, label: 'Yes' },
                                { value: false, label: 'No' },
                              ]}
                              label="Organic"
                              required
                            />
                            <Field
                              name={`animals.${index}.comments`}
                              component={TextField}
                              label="Comments"
                              required
                            />
                            <div style={{ marginTop: 20 }}>
                              <button
                                type="button"
                                onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                              >
                                -
                              </button>
                              <button
                                type="button"
                                onClick={() => arrayHelpers.push(emptyAnimalsObject)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <button
                          type="button"
                          onClick={() => arrayHelpers.push(emptyAnimalsObject)}
                        >
                          {/* show this when user has removed all friends from the list */}
                          Add a friend
                        </button>
                      )}
                      <div style={{ marginTop: 20 }}>
                        <button type="submit">Submit</button>
                      </div>
                    </div>
                  )}
                />
                <Field
                  required
                  name="gender"
                  label="Gender"
                  options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' },
                  ]}
                  component={Select}
                />
                <Field 
                  name="generalComments" 
                  label="General Comments" 
                  component={TextField} 
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={!formik.dirty || loading}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Create Farm
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  )
}

export default RegisterFarmView