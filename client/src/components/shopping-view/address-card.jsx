/* eslint-disable react/prop-types */
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { MapPin, Phone, FileText, Crown, Shield, Star } from "lucide-react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
        selectedId?._id === addressInfo?._id
          ? "border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-lg transform scale-[1.02]"
          : "border-amber-200 hover:border-amber-300 bg-gradient-to-br from-white to-amber-50/30 hover:shadow-lg"
      } group overflow-hidden relative`}
    >
      {/* Premium Selection Indicator */}
      {selectedId?._id === addressInfo?._id && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600"></div>
      )}

      <CardContent className="p-5 space-y-4">
        {/* Header with Location and Delivery Fee */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-600" />
            <Badge variant="outline" className="text-xs border-amber-200 text-amber-700 bg-amber-50">
              {addressInfo?.county}
            </Badge>
          </div>
          <Badge className="text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-700 text-white border-none shadow-md">
            <Star className="w-3 h-3 mr-1" />
            KSh {addressInfo?.deliveryFee || 0}
          </Badge>
        </div>

        {/* Address Hierarchy with Luxury Styling */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-full">
              <MapPin className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-sm flex-1">
              <div className="font-bold text-gray-900 text-base">{addressInfo?.location}</div>
              <div className="text-amber-700 font-medium">{addressInfo?.subCounty}</div>
              <div className="text-gray-600 text-xs font-medium">{addressInfo?.county}</div>
            </div>
          </div>
          
          {addressInfo?.specificAddress && (
            <div className="pl-11 text-sm text-gray-700 bg-amber-50/50 p-3 rounded-lg border border-amber-200/50">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="font-medium">{addressInfo.specificAddress}</span>
              </div>
            </div>
          )}
        </div>

        {/* Phone with Premium Styling */}
        {addressInfo?.phone && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-amber-100/50 p-3 rounded-lg border border-amber-200/50">
            <div className="p-2 bg-white rounded-full shadow-sm">
              <Phone className="w-4 h-4 text-amber-600" />
            </div>
            <Label className="text-sm font-medium text-gray-800">{addressInfo.phone}</Label>
          </div>
        )}

        {/* Notes with Luxury Treatment */}
        {addressInfo?.notes && (
          <div className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-blue-100/50 p-3 rounded-lg border border-blue-200/50">
            <div className="p-2 bg-white rounded-full shadow-sm">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <Label className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Special Instructions</Label>
              <Label className="text-sm text-gray-700 block mt-1">{addressInfo.notes}</Label>
            </div>
          </div>
        )}

        {/* Full Address Display - Luxury Card Style */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-inner">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Complete Address</div>
              <div className="text-sm text-gray-700 font-medium leading-relaxed">
                {addressInfo?.address}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 bg-gradient-to-r from-amber-50/50 to-amber-100/30 border-t border-amber-200/50 flex justify-between gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
          className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 transition-all duration-300 font-medium"
        >
          <Crown className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button 
          variant="outline"
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
          className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 font-medium"
        >
          <Shield className="w-4 h-4 mr-2" />
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;