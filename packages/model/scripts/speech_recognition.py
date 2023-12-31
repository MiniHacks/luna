import os
import azure.cognitiveservices.speech as speechsdk
import time
import requests
import wave

def speech_recognize_keyword_from_microphone():
    """performs keyword-triggered speech recognition with input microphone"""
    speech_config = speechsdk.SpeechConfig(subscription=os.environ.get('SPEECH_KEY'), region=os.environ.get('SPEECH_REGION'))
#     speech_config.speech_recognition_language="en-US"

    # Creates an instance of a keyword recognition model. Update this to
    # point to the location of your keyword recognition model.
    model = speechsdk.KeywordRecognitionModel("luna.table")

    # The phrase your keyword recognition model triggers on.
    keyword = "Hey Luna"

    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config)

    done = False

    # def stop_cb(evt):
    #     """callback that signals to stop continuous recognition upon receiving an event `evt`"""
    #     print('CLOSING on {}'.format(evt))
    #     nonlocal done
    #     done = True

    def recognizing_cb(evt):
        """callback for recognizing event"""
        if evt.result.reason == speechsdk.ResultReason.RecognizingKeyword:
            print('HEY LUNA HEARD!!')
        elif evt.result.reason == speechsdk.ResultReason.RecognizingSpeech:
            print('RECOGNIZING')
        requests.get(f"http://localhost:8000/process/{evt.result.text}")

    def recognized_cb(evt):
        """callback for recognized event"""
        if evt.result.reason == speechsdk.ResultReason.RecognizedKeyword:
            print('RECOGNIZED KEYWORD')
        elif evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
            print('RECOGNIZED')
        elif evt.result.reason == speechsdk.ResultReason.NoMatch:
            print('NOMATCH')

        print(evt.result.text)
        requests.get(f"http://localhost:8000/process/{evt.result.text}")

    def canceled_cb(evt):
        """callback for canceled event"""
        print('CANCELED')
        requests.get('http://localhost:8000/status/CANCELED', data=evt)

    def session_started_cb(evt):
        """callback for session started event"""
        print('SESSION STARTED')
        requests.get('http://localhost:8000/status/ACTIVE', data=evt)

    def session_stopped_cb(evt):
        """callback for session stopped event"""
        print('SESSION STOPPED + FINALIZED')
        url = f"http://localhost:8000/finalize"
        requests.get(url)
#         requests.get('http://localhost:8000/status/STOPPED', data=evt)

    # Connect callbacks to the events fired by the speech recognizer
    speech_recognizer.recognizing.connect(recognizing_cb)
    speech_recognizer.recognized.connect(recognized_cb)
    speech_recognizer.session_started.connect(session_started_cb)
    speech_recognizer.session_stopped.connect(session_stopped_cb)
    speech_recognizer.canceled.connect(canceled_cb)
    # stop continuous recognition on either session stopped or canceled events
    # speech_recognizer.session_stopped.connect(stop_cb)
    # speech_recognizer.canceled.connect(stop_cb)

    # Start keyword recognition
    speech_recognizer.start_keyword_recognition(model)
    print('Say something starting with "{}" followed by whatever you want...'.format(keyword))
    while not done:
        time.sleep(.05)

    # speech_recognizer.stop_keyword_recognition()
speech_recognize_keyword_from_microphone()
