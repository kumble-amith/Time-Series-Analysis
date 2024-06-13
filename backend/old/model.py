import pandas as pd
from sklearn.preprocessing import MinMaxScaler ,StandardScaler
from keras.models import Sequential 
from keras.layers import Dense, LSTM 
from sklearn.linear_model import LinearRegression
import numpy as np
import pickle
def predict(files = "test" , to_pred = 'humidity' ,roll = 100,train_split = 0.7,epoch = 2 ,num_days = 5 , modelUser = 'LinearRegression' ,scalerUser = 'StandardScaler' ):
    class Dates:
        def __init__(self) -> None:
            self.counts = 0
        def handleDates(self):
            self.counts += 1
            return self.counts
    dt = Dates()
    # ,converters={'date' : dt.handleDates}
    df1 = pd.read_csv("DailyDelhiClimateTrain.csv")
    df2 = pd.read_csv("DailyDelhiClimateTest.csv")
    df = pd.concat([df1 , df2] ,axis=0)
    df['MA_for_250_days'] = df[to_pred].rolling(roll).mean()
    df['percentage_change_cp'] = df[to_pred].pct_change()
    humidity = df[[to_pred]]
    scaler = None
    if scalerUser == 'MinMaxScaler':
        scaler = MinMaxScaler(feature_range=(0,1))
        scaled_data = scaler.fit_transform(humidity)
    
    if scalerUser == 'StandardScaler':
        scaler = StandardScaler()
        scaled_data = scaler.fit_transform(humidity)
    
    if not scaler:
        return {
            'error' : 'Model Not Defined'
        }
    x_data = []
    y_data = []

    for i in range(roll, len(scaled_data)):
        x_data.append(scaled_data[i-roll:i])
        y_data.append(scaled_data[i])
        
    x_data, y_data = np.array(x_data), np.array(y_data)
    splitting_len = int(len(x_data)*train_split)
    x_train = x_data[:splitting_len]
    y_train = y_data[:splitting_len]

    x_test = x_data[splitting_len:]
    y_test = y_data[splitting_len:]
    if modelUser == 'LSTM':
        model = Sequential()
        model.add(LSTM(128, return_sequences=True, input_shape=(x_train.shape[1],1)))
        model.add(LSTM(64,return_sequences=False))
        model.add(Dense(25))
        model.add(Dense(1))
        model.compile(optimizer='adam', loss='mean_squared_error')
        model.fit(x_train, y_train, batch_size=1, epochs = epoch)
        predictions = model.predict(x_test[:num_days])
        inv_predictions = scaler.inverse_transform(predictions)
        inv_y_test = scaler.inverse_transform(y_test[:num_days])
        rmse = np.sqrt(np.mean( (inv_predictions - inv_y_test)**2))
        model.save(f"{files}.keras")
        obj = {
            'rmse': rmse,
            'trained_model' : model ,
            'prediction' : inv_predictions, 
        }
        print(rmse)
    if modelUser == 'LinearRegression':
        model = LinearRegression()
        # print(x_train.shape)
        x_train = x_train.reshape((x_train.shape[0] , x_train.shape[1]))
        x_test = x_test.reshape((x_test.shape[0] , x_test.shape[1]))

        model.fit(x_train , y_train)
        prediction = model.predict(x_test[:num_days])
        inv_predictions = scaler.inverse_transform(prediction)
        inv_y_test = scaler.inverse_transform(y_test[:num_days])
        rmse = np.sqrt(np.mean( (inv_predictions - inv_y_test)**2))
        with open(f'{files}.pickle', 'wb') as handle:
            pickle.dump(model, handle)
        obj = {
            'rmse': rmse,
            'trained_model' : model ,
            'prediction' : inv_predictions, 
        }
        print(rmse)
if __name__ == '__main__':
    predict()