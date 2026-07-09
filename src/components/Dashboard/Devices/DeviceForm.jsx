import React, { useState } from "react";
import { InputField } from "../../common/InputField";
import { SelectField } from "../../common/SelectField";
import { Button } from "../../common/Button";
import { apiDevice } from "../../../services/deviceService";

export const DeviceForm = ({ onSuccess, onCancel }) => {
  const [registerStep, setRegisterStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });

  const [deviceCreds, setDeviceCreds] = useState({ id: "", secret: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (registerStep === 1) {
      console.log(formData)
      const data = await apiDevice.createDevice(formData)
      setDeviceCreds({
        id: data.device_id,
        secret: data.api_key
      });
      setRegisterStep(2);
      return;
    }

    try {
      if (onSuccess) {
        onSuccess({
          ...formData,
          id: deviceCreds.id,
          deviceSecret: deviceCreds.secret,
        });
      }
    } catch (err) {
      // Context handles toast
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 w-full">
      {/* WINDOW 1 */}
      {registerStep === 1 && (
        <div className="space-y-2 animate-fade-in-up">
          <h1 className="text-3xl font-bold">ABOUT YOU</h1>

          <InputField
            id="name"
            label="Device Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter device name"
            required
          />
          <SelectField
            id="deviceType"
            label="Device Type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            options={[
              { label: "Hub", value: 0 },
              { label: "Node", value: 1 },
            ]}
            required
          />

          <div className="flex gap-3 pt-2">
            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                className="w-1/3 opacity-80"
              >
                Cancel
              </Button>
            )}
            <Button type="submit" className={onCancel ? "w-2/3" : "w-full"}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* WINDOW 2 */}
      {registerStep === 2 && (
        <div className="space-y-4 animate-fade-in-up">
          <h1 className="text-3xl font-bold">DEVICE CREDENTIALS</h1>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 px-1">
                Device ID
              </label>
              <div className={`w-full px-5 py-4 bg-neutral-900 border-neutral-800 rounded-xl border-1 flex items-center justify-between`}>
                <span className="font-mono text-sm">{deviceCreds.id}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 px-1">
                Device Secret
              </label>
              <div className={`w-full px-5 py-4 bg-neutral-900 border-neutral-800 rounded-xl border-1 flex items-center justify-between`}>
                <span className="font-mono text-sm">{deviceCreds.secret}</span>
              </div>
            </div>
            
            <p className={`text-xs text-neutral-500 px-1 pt-2`}>
              Please copy these credentials. You won't be able to see the secret again.
            </p>
          </div>

          <div className="flex pt-2">
            <Button type="submit" className="w-2/3">
              Complete
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};
