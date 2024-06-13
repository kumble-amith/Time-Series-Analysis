import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle

import os


def check_file_exists(file_name):
    return os.path.exists(file_name)


def predict(files="NFLX.csv", op="Low", scalerUser="StandardScaler", epoch=5, predDays=15, ip="Date"):

    df = pd.read_csv("./files/"+files)

    data = df[op]
    scaler = None
    if scalerUser == "MinMaxScaler":
        scaler = MinMaxScaler()
        data = np.array(data)
        data = data.reshape(-1, 1)
        dfx = scaler.fit_transform(data)
    if scalerUser == "StandardScaler":
        scaler = StandardScaler()
        data = np.array(data)
        data = data.reshape(-1, 1)
        dfx = scaler.fit_transform(data)
    X = []
    y = []
    for i in range(0, len(dfx)-1):
        X.append(dfx[0:i+1])
        y.append(dfx[i+1])

    X_new = []
    for i in range(len(X)):
        temp = []
        for j in range(len(X[i])):
            for k in range(len(X[i][j])):
                temp.append(X[i][j][k])
        X_new.append(temp)

    max_len = max([len(x) for x in X_new])

    X_new_padded = pad_sequences(
        X_new, maxlen=max_len, dtype='float64', padding='pre')

    y_new_padded = pad_sequences(
        y, maxlen=max_len, dtype='float64', padding='pre')

    X_new_padded = X_new_padded.reshape(-1, max_len, 1)
    y = np.array(y)
    y_new_padded = y_new_padded.reshape(-1, 1)

    if (check_file_exists(f'./trained_models/{files[:-4]}_{op}_{scalerUser}_{epoch}.keras') == False):
        print("Model not found, training new model")
        model = Sequential()
        model.add(LSTM(64, return_sequences=True,
                  input_shape=(X_new_padded[0].shape)))
        model.add(LSTM(32))
        model.add(Dense(16, activation='relu'))
        model.add(Dense(1))

        model.compile(loss='mean_squared_error',
                      optimizer='adam', metrics=['mse'])

        hist = model.fit(X_new_padded, y, epochs=epoch)

        pickle.dump(hist, open(
            f'./trained_models/{files[:-4]}_{op}_{scalerUser}_{epoch}.pkl', 'wb'))

        model.save(
            f'./trained_models/{files[:-4]}_{op}_{scalerUser}_{epoch}.keras')
    else:
        print("Model found, loading model")
        hist = pickle.load(
            open(f'./trained_models/{files[:-4]}_{op}_{scalerUser}_{epoch}.pkl', 'rb'))
        model = tf.keras.models.load_model(
            f'./trained_models/{files[:-4]}_{op}_{scalerUser}_{epoch}.keras')

    X_trial = np.expand_dims(X_new_padded[len(X)-1], axis=0)

    predictions = []
    temp = X_trial
    for i in range(0, predDays):
        y_pred = model.predict(temp)
        predictions.append(y_pred[0][0])
        temp[0] = (np.append(temp[0][1:], y_pred[0][0])).reshape(len(X), 1)

    predictions = np.array(predictions, dtype='float64')

    predictions = scaler.inverse_transform(predictions.reshape(1, -1))
    # print(predictions)
    # print(data[-5:])
    y_values = np.array(df[op], dtype='object')
    x_values = np.array(df[ip])

    print(hist.history['loss'][-1])
    print(df[op].shape, df[ip].shape, predictions[0].shape)
    obj = {
        'loss':  hist.history['loss'],
        'predValue': list(predictions[0]),
        'y': y_values.tolist(),
        'x': x_values.tolist(),
    }

    return obj


if __name__ == "__main__":
    predict()
